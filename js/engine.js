/*!
 * Abstract Game Engine
 */

(function( window ) {

if ( window.Game ) {
	// Don't include this file twice.
	return;
}

var Game = window.Game = {
	/**
	 * Holds game settings. Contains the required default settings.
	 * But additional game settings can be added based on what your
	 * game needs.
	 * @object Game.settings
	 *   @prop fps {Number} Frames per second
	 *   @prop startTime {Number} The start time in milliseconds of the game
	 *   @prop time {Number} The time in milliseconds that can be used in various ways
	 *   @prop canvas {CanvasElement} The main canvas
	 *   @prop ctx {Canvas2DContext} The canvas 2D context
	 */
	settings: {
		fps: 30,
		startTime: 0,
		time: 0,
		canvas: null,
		ctx: null,
		canvasOffset: { x: 0, y: 0 }
	},

	/**
	 * Holds game entities
	 */
	entities: [],
	
	/**
	 * Holds the game entities that will be destroyed this update
	 */
	killList: [],

	/**
	 * If the game engine is initialized or not
	 */
	initialized: false,

	/**
	 * Initialization of the game engine
	 */
	init: function( canvas ) {
		if ( !canvas ) { // quick and dirty way to check if it is null or undefined
			throw "Init function requires 'canvas' parameter";
		}
		this.settings.canvas = canvas;
		this.settings.ctx = canvas.getContext( "2d" );
		if ( !this.settings.ctx ) {
			throw "Could not get canvas 2D context";
		}

		var canvasBound = canvas.getBoundingClientRect();
		this.settings.canvasOffset = _.make( Game.Vector2 ).init(
			x: canvasBound.left,
			y: canvasBound.top
		);

		this.InputManager.init();
		this.initialized = true;

		return this;
	},

	/**
	 * State-based game
	 * addState takes a String, and a callback.
	 * Callback will be used in update and draw function.
	 * Callback is an object that has two methods: update and draw
	 * update should take one parameter: delta (time elapsed between update calls)
	 * draw should take one parameter: ctx (canvas 2D context)
	 */
	states: {},
	state: null,
	addState: function( name, callback ) {
		// Checks if there's already state with the name
		if ( states[name] === undefined || states[ name ] === null ) {
			states[name] = callback;
		} else {
			throw "State already added: " + name;
		}
	},

	/**
	 * If the game engine is running and false if not.
	 */
	alive: false,

	/**
	 * Starts the game engine
	 */
	start: function() {
		if ( !this.initialized ) {
			throw "Game engine not initialized";
		}
		if ( !this.alive ) {
			this.settings.startTime = Date.now();
			this.settings.time = this.settings.startTime;
			setInterval( this.tick, 1000 / ( this.settings.fps || 30 ) );
			this.alive = true;
		}
	},

	/**
	 * Stops the game enegine
	 */
	stop: function() {
		clearInterval( this.tick );
		this.alive = false;
	},

	/**
	 * Function to call each frame
	 */
	tick: function() {
		this.update();
		this.draw();
	},

	/**
	 * Updates the game state. Should not be overridden.
	 * Override state's update function instead.
	 */
	update: function() {
		var now = Date.now();
		this.state.update( now - this.settings.time ); // delta
		this.settings.time = now;
	},

	/**
	 * Draws the current game state to the canvas.
	 * Should not be overridden.
	 * Override state's draw function instead.
	 */
	draw: function() {
		this.state.draw( this.settings.ctx );
	},

	/**
	 * Asset object
	 * Holds necessary information about an asset
	 * callback is called when the asset has loaded
	 */
	Asset: {

		// Default properties
		type: null,
		src: "",
		callback: function( asset ) {},

		init: function( type, src, callback ) {
			this.type = type;
			this.src = src;
			if ( callback ) {
				this.callback = callback;
			}
		}
	},

	/**
	 * Object for holding and loading assets
	 * It is a singleton.
	 */
	AssetManager: {
		/**
		 * Holds Game assets
		 */
		assets: {},

		/**
		 * asset types
		 * users can add custom asset types.
		 * callback should have one parameter: asset
		 * for convenient purposes.
		 */
		assetType: {
			image: function( asset, callback ) {
				var img = new Image();
				img.onload = function() {
					callback( asset );
				};
				img.src = asset.src;
				asset.content = img;
			},
			audio: function( asset, callback ) {
				var audio = document.createElement( "audio" );
				audio.onload = function() {
					callback( asset );
				};
				audio.src = asset.src;
				asset.content = audio;
			},
			json: function( asset, callback ) {
				_.ajax( asset.src, null, function( msg ) {
					asset.content = JSON.parse( msg );
					if ( callback ) {
						callback( asset );
					}
				});
			}
		},

		/**
		 * number assets
		 */
		assetCount: 0,
		loadedCount: 0,

		/**
		 * Adds an asset
		 */
		add: function( name, asset ) {
			this.assets[name] = asset;
			this.assetCount++;
		},

		/**
		 * Gets an asset
		 */
		get: function( name ) {
			return this.assets[name];
		},

		/**
		 * Checks if all assets in asset manager have been loaded
		 */
		get loaded() { return this.assetCount === this.loadedCount },

		/**
		 * Loads all assets currently in the asset manager
		 */
		load: function( onAllLoad, onEachLoad ) {
			this.callback = onAllLoad;

			var that = this;

			for ( var i in this.assets ) {
				if ( this.assets.hasOwnProperty( i ) ) {
					if ( !this.assetType.hasOwnProperty( i.type ) ) {
						throw "The asset type is not added: " + i.type;
					}
					this.assetType[i.type]( i, function( asset ) {
						that.loadedCount++;
						if ( onEachLoad ) {
							onEachLoad();
						}

						asset.callback( asset );

						if ( that.loaded && that.callback ) {
							that.callback();
						}
					} );
				}
			}
		}
	},

	/**
	 * Object for handling input event
	 * Singleton
	 */
	InputManager: {

		// Default properties
		events: [],

		init: function() {
			var that = this;

			_.bind( Game.settings.canvas, "click", function( e ) {
				return that.handleClick( e );
			} );
		},

		handleClick: function( e ) {
			var event = {
				x: e.pageX - Game.settings.canvasOffset.x,
				y: e.pageY - Game.settings.canvasOffset.y
			};

			this.events.push( event );

			return false;
		}
	},

	/**
	 * Abstract object for representing an entity in the game.
	 */
	Entity: {

		// Default properties
		// Dummy object in place of Game.Box
		bound: { x: 0, y: 0, w: 0, h: 0 },
		img: null,
		angle: 0,

		// Didn't say init because init would get overriden by "subclasses"
		entityInit: function( img, x, y, w, h ) {
			// ensures that this.bound is Game.Box
			this.bound = _.make( Game.Box ).init( x, y, w, h );
			this.img = img;
			this.angle = 0;
		},

		/**
		 * Updates the entity
		 */
		update: function( delta ) {

		},

		/**
		 * Draws the entity to the canvas
		 */
		draw: function( ctx ) {
			if ( this.img ) {
				ctx.save();
				
				ctx.translate( this.bound.x, this.bound.y );
				
				// Rotate the image
				if ( this.angle ) {
					ctx.rotate( this.angle );
				}
				
				// Draw the image
				var translatedBound = this.bound.copy();
				translatedBound.center = [0, 0];
				this.img.drawAt( ctx, translatedBound );
				
				ctx.restore();
			} else {
				// Set color
				ctx.fillStyle = "black";			
				
				ctx.save();						
				
				ctx.translate( this.bound.x, this.bound.y );
				
				// Rotate the image
				if ( this.angle ) {
					ctx.rotate( this.angle );
				}
				
				// Draw the image
				ctx.fillRect( -this.bound.w / 2, -this.bound.h / 2, this.bound.h, this.bound.w );
				
				ctx.restore();
			}
		}
	},

	/**
	 * tile stub for 2D tile map
	 * It really is a stub, so please override this
	 */
	Tile: {

		/**
		 *Default properties
		 * Row and column for representing the index of the map,
		 * and x and y for representing pixel values
		 */
		row: 0,
		col: 0,

		init: function( row, col, map, img ) {
			this.row = row;
			this.col = col;
			var bound = _.make( Game.Box ).init( map.toCoords( row, col ), map.tileLength, map.tileLength );
			this.entityInit( img, bound );
		}
	},

	/**
	 * 2D tile map
	 */
	TileMap: {

		/**
		 * Default properties
		 * mapOffset: offset from the canvasOffset. Shows where the top left of the map is
		 * layout: 2D Array with numbers that corressponds with Tile.tiles
		 * tileLength: The pixel value of each tile length
		 * tileLayout: 2D Array that has Tile objects instead of numbers from layout
		 */
		mapOffset: { x: 0, y: 0 },
		layout: [],
		tileLength: 0,
		rows: 0,
		cols: 0,
		tileLayout: [],

		init: function( layout, tileLength ) {

			this.layout = layout;
			this.tileLength = tileLength;
			
			this.rows = layout.length;
			this.cols = layout[0].length; // Assuming it's not a zig-zagged 2D Array
			this.tileLayout = [];
			for ( var row = 0; row < this.rows; row++ ) {
				this.tileLayout.push( [] );
			}

			this.convertLayout();
		},

		/**
		 * For converting from layout to tileLayout
		 * Override this if you want a custom Tile object.
		 */
		convertLayout: function() {
			for ( var row = 0; row < this.rows; row++ ) {
				for ( var col = 0; col < this.cols; col++ ) {
					this.tileLayout[row][col] = _.make( Game.Tile ).init( row, col, this );
				}
			}
		},

		draw: function( ctx ) {
			this.forEach( function( tile ) {
				tile.draw( ctx );
			} );
		},

		/**
		 * Iterate each tiles and do something
		 * fn takes a parameter: tile.
		 */
		forEach: function( fn ) {
			for ( var row = 0; row < this.rows; row++ ) {
				for ( var col = 0; col < this.cols; col++ ) {
					fn( this.tileLayout[row][col] );
				}
			}
		},

		/**
		 * Converting coordinates to map index
		 */
		toMapIndex: function( x, y ) {
			var row = Math.floor( ( y - this.mapOffset.y ) / this.tileLength );
			var col = Math.floor( ( x - this.mapOffset.x ) / this.tileLength );

			return { row: row, col: col };
		},

		/**
		 * Converting map index to coordinates
		 */
		toCoords: function( row, col ) {
			var y = this.mapOffset.y + row * this.tileLength;
			var x = this.mapOffset.x + col * this.tileLength;

			return _.make( Game.Vector2 ).init( x, y );
		}
	},

	/**
	 * Box object constructor. Box object will define most of dimensions.
	 * @function Box
	 * @param x {Number, Vector2, Box} X value of top left corner, vector representing top left corner, Box to copy
	 * @param y {Number, Number, undefined} Y value of top left corner, width
	 * @param w {Number, Number, undefined} Width, height
	 * @param h {Number, undefined, undefined} Height
	 */
	Box: {

		// Default properties
		x: 0,
		y: 0,
		w: 0,
		h: 0,

		init: function( x, y, w, h ) {
			if ( this.canBeBox( x ) ) {
				this.set( x );
			} else if ( Game.Vector2.canBeVector2( x ) ) {
				this.topLeft = x;
				this.w = y || 0;
				this.h = w || 0;
			} else {
				this.x = x || 0;
				this.y = y || 0;
				this.w = w || 0;
				this.h = h || 0;
			}
			return this;
		},

		/**
		 * Getters and setters
		 */
		get left() { return this.x; },
		get top() { return this.y; },
		get right() { return this.x + this.w; },
		get bottom() { return this.y + this.h; },

		get centerx() { return this.x + this.w / 2; },
		get centery() { return this.y + this.h / 2; },

		get center() { return _.make( Game.Vector2 ).init( this.centerx, this.centery ); },
		get topLeft() { return _.make( Game.Vector2 ).init( this.left, this.top ); },
		get topRight() { return _.make( Game.Vector2 ).init( this.right, this.top ); },
		get bottomLeft() { return _.make( Game.Vector2 ).init( this.left, this.bottom ); },
		get bottomRight() { return _.make( Game.Vector2 ).init( this.right, this.bottom ); },

		get size() { return { w: this.w, h: this.h }; },

		set left( value ) { this.x = value; },
		set top( value ) { this.y = value; },
		set right( value ) { this.x = value - this.w; },
		set bottom( value ) { this.y = value - this.h; },

		set centerx( value ) { this.x = value - this.w / 2; },
		set centery( value ) { this.y = value - this.h / 2; },

		// Basically, you can put any Object with x or y value e.g. Game.Vector2
		// or an array e.g. [123, 284]
		set center( value ) {
			this.centerx = value.x || value[0] || 0;
			this.centery = value.y || value[1] || 0;
		},
		set topLeft( value ) {
			this.left = value.x || value[0] || 0;
			this.top = value.y || value[1] || 0;
		},
		set topRight( value ) {
			this.right = value.x || value[0] || 0;
			this.top = value.y || value[1] || 0;
		},
		set bottomLeft( value ) {
			this.left = value.x || value[0] || 0;
			this.bottom = value.y || value[1] || 0;
		},
		set bottomRight( value ) {
			this.right = value.x || value[0] || 0;
			this.bottom = value.y || value[1] || 0;
		},

		set size( value ) {
			this.w = value.w || value[0] || 0;
			this.h = value.h || value[1] || 0;
		},

		/**
		 * Set this box with another box's property
		 */
		set: function( box ) {
			// This works because of the setters of topLeft and size
			this.topLeft = box;
			this.size = box;
			return this;
		},

		/**
		 * Returns a copy
		 */
		copy: function() {
			return _.make( Game.Box ).init( this.x, this.y, this.w, this.h );
		},

		/**
		 * Basic collision with other Box
		 */
		collideWith: function( box ) {
			return !(
				this.bottom < box.top ||
				this.top > box.bottom ||
				this.right < box.left ||
				this.left > box.right
			);
		},

		/**
		 * Check collision with a point
		 */
		isPointInside: function( x, y ) {
			return this.left < x && x < this.right &&
				this.top < y && y < this.top;
		},

		/**
		 * Check if it can be a box
		 * meaning has x, y, w, h
		 */
		canBeBox: function( box ) {
			return Game.Vector2.canBeVector2( box ) &&
				box.hasOwnProperty( "w" ) && box.hasOwnProperty( "h" );
		}
	},

	/*
	 * Vector2 Object Constructor
	 * It holds position or vector, either one
	 * @function Vector2
	 * @params x {Number, Vector2} X value, vector to copy
	 * @params y {Number, undefined} Y value
	 */
	Vector2: {

		// Default properties
		x: 0,
		y: 0,

		init: function( x, y ) {
			if ( this.canBeVector2( x ) ) {
				this.set( x );
			} else {
				this.x = x || 0;
				this.y = y || 0;
			}
			return this;
		},

		/**
		 * Operations, since JavaScript doesn't have operation overloading
		 * add: Returns the sum of the two vectors
		 * sub: subtract - Returns the difference between the two vectors
		 * mul: multiply - Returns the component-wise multiplication of the vectors
		 * div: divide - Returns the component-wise division of the vectors
		 */
		add: function( other ) {
			return _.make( Vector2 ).init( this.x + other.x, this.y + other.y );
		},
		sub: function( other ) {
			return _.make( Vector2 ).init( this.x - other.x, this.y - other.y );
		},
		mul: function( other ) {
			return _.make( Vector2 ).init( this.x * other.x, this.y * other.y );
		},
		div: function( other ) {
			return _.make( Vector2 ).init( this.x / other.x, this.y / other.y );
		},

		get squaredLength() { return this.x * this.x + this.y * this.y; },
		get length() { return Math.sqrt( this.squaredLength ); },
		get angle() { return Math.atan2( this.y, this.x ); },

		/*
		 * Set this vector with other vector's property
		 */
		set: function( other ) {
			this.x = other.x || 0;
			this.y = other.y || 0;
			return this;
		},

		/*
		 * Returns a copy of this vector
		 */
		copy: function() {
			return _.make( Vector2 ).init( this.x, this.y );
		},

		// Returns the vector with all components multiplied by the scalar parameter
		// You would use reciprocal if you are dividing
		scale: function( scale ) {
			return _.make( Vector2 ).init( this.x * scale, this.y * scale );
		},

		// Returns the dot product between the two vectors
		dot: function( other ) {
			return this.x * other.x + this.y * other.y;
		},

		// Returns a vector pointing on the same direction, but with a length of 1
		unit: function() {
			return this.scale( 1 / this.length );
		},

		// Rotates the vector by the specified angle
		rotate: function( angle ) {
			this.x = this.x * Math.cos( angle ) - this.y * Math.sin( angle );
			this.y = this.x * Math.sin( angle ) + this.y * Math.cos( angle );
			return this;
		},

		/**
		 * Check if it can be a vector2 or not
		 * meaning if it has x and y
		 */
		canBeVector2: function( vec ) {
			return vec.hasOwnProperty( "x" ) && vec.hasOwnProperty( "y" );
		}
	}
}

_.extend( Game.Tile, Game.Entity );

// TODO

})( window );
