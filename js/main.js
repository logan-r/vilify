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
		fps: 0,
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
	init: function( canvas, fps ) {
		if ( !canvas ) { // quick and dirty way to check if it is null or undefined
			throw "Init function requires 'canvas' parameter";
		}
		this.settings.canvas = canvas;
		this.settings.ctx = canvas.getContext( "2d" );
		
		if ( !this.settings.ctx ) {
			throw "Could not get canvas 2D context";
		}
		
		this.settings.fps = fps;

		var canvasBound = canvas.getBoundingClientRect();
		this.settings.canvasOffset = _.make( Game.Vector2 ).init(
			canvasBound.left,
			canvasBound.top
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
	StateManager: {
		states: {},
		state: null,
		add: function( name, callback, first ) {
			// Checks if there's already state with the name
			if ( this.states[name] === undefined || this.states[ name ] === null ) {
				this.states[name] = callback;
				if ( first ) {
					this.state = callback;
				}
			} else {
				throw "State already added: " + name;
			}
		},

		change: function( name ) {
			if ( !this.states[name] ) {
				throw "State doesn't exist: " + name;
			}

			this.state = this.states[name];
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
		Game.update();
		Game.draw();
	},

	/**
	 * Updates the game state. Should not be overridden.
	 * Override state's update function instead.
	 */
	update: function() {
		var now = Date.now();
		var delta = now - this.settings.time;
		
		updateNorm = this.StateManager.state.update( delta );
		
		if ( updateNorm ) {
			for ( var i = 0; i < this.entities.length; i++ ) {
				this.entities[i].update( delta );
			}
			
			this.InputManager.unload();
		}
		
		this.settings.time = now;
	},

	/**
	 * Draws the current game state to the canvas.
	 * Should not be overridden.
	 * Override state's draw function instead.
	 */
	draw: function() {
		drawNorm = this.StateManager.state.draw( this.settings.ctx );
		
		if ( drawNorm ) {
			for ( var i = 0; i < this.entities.length; i++ ) {
				this.entities[i].draw( this.settings.ctx );
			}
		}
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

			return this;
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
					this.assets[i].type( this.assets[i], function( asset ) {
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
		initalized: false,

		init: function() {
			var that = this;

			_.bind( Game.settings.canvas, "click", function( e ) {
				return that.handleClick( e );
			} );
			
			this.initalized = true;
		},

		handleClick: function( e ) {
			var event = {
				type: "click",
				x: e.pageX - Game.settings.canvasOffset.x,
				y: e.pageY - Game.settings.canvasOffset.y
			};

			this.events.push( event );
			return false;
		},
		
		unload: function() {
			// Loop through events
			for ( var i = 0; i < this.events.length; i++ ) {
				e = this.events[i];
				if ( e.type == "click" ) {
					for ( var j = Game.entities.length - 1; j >= 0; j-- ) {
						Game.entities[j].click();
					}
				}
			}
			
			// Clear events
			this.events = [];
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
				
				ctx.translate( this.bound.centerx, this.bound.centery );
				
				// Rotate the image
				if ( this.angle ) {
					ctx.rotate( this.angle );
				}
				
				// Draw the image
				ctx.fillRect( -this.bound.w / 2, -this.bound.h / 2, this.bound.w, this.bound.h );
				
				ctx.restore();
			}
		},
		
		click: function() {
			
		}
	},
	
	/**
	 * A clickable entity for game UIs
	 */
	Button: {
		text: null,
		font: null,
		text_color: null,
		bg_color: null,
		
		/**
		 * Initalize button
		 * text: {String} The button's text
		 * font: {Game.Font} The font used
		 * x & y: {Integer} & {Integer} x and y location of the button
		 * padding_x: {Integer} Padding on the x axis of the button
		 * padding_y: {Integer} Padding on the y axis of the button
		 * text_color: {String} Color of the text
		 * bg_color: {String} Color of the background
		 */
		init: function( text, font, x, y, padding_x, padding_y, text_color, bg_color ) {
			this.text = text;
			this.font = font;
			this.text_color = text_color;
			this.bg_color = bg_color;
			this.entityInit( null, x, y, font.measureText( text ) + padding_x * 2, font.size + padding_y * 2 );
			return this;
		},
		
		/**
		 * Draws the button to the canvas
		 */
		draw: function( ctx ) {
			ctx.save();
							
			ctx.translate( this.bound.centerx, this.bound.centery );
			
			// Rotate the button
			if ( this.angle ) {
				ctx.rotate( this.angle );
			}
			
			// Draw the button's background
			ctx.fillStyle = this.bg_color;
			ctx.fillRect( -this.bound.w / 2, -this.bound.h / 2, this.bound.w, this.bound.h );
			
			// Draw the button's text
			ctx.fillStyle = this.text_color;
			ctx.font = this.font.toString();
			ctx.fillText( this.text, -this.font.measureText( this.text ) / 2, this.font.size / 3 )
			
			ctx.restore();
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
	 * Font  object constructor
	 */
	Font: {
		/**
		 * size: {Integer} Height of the font
		 * family: {String} Font name (e.g. 'Arial' or 'Times New Roman')
		 */
		size: 0,
		family: 0,
		
		init: function( size, family ) {
			this.size = size;
			this.family = family;
			return this;
		},
		
		/**
		 * Measure the width of a string
		 * text: {String} text to measure
		 */
		measureText: function( text ) {
			fontTMP = Game.settings.ctx.font;
			Game.settings.ctx.font = this.toString();
			return Game.settings.ctx.measureText( text ).width;
			Game.settings.ctx.font = fontTMP;
		},
		
		/**
		 * Converts font to string
		 * Usage: `ctx.font = [FontObject].toString();`
		 */
		toString: function() {
			return this.size.toString() + "px " + this.family;
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
				this.top < y && y < this.bottom;
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

_.extend( Game.Button, Game.Entity );
_.extend( Game.Tile, Game.Entity );

})( window );
/*!
 * Vilify Core
 */

(function( window ) {

var Game = window.Game;

_.deepCopy( Game, {

	name: "Vilify",
	version: "1.0.0",

	settings: {
		map: null,
		sidebar: null,
		imgRoot: "images/",
		gameDataRoot: "game_data/",
		data: null
	},

	Tile: {

		// Default property
		id: null,

		/**
		 * The tiles of Vilify
		 */
		tiles: {
			WALKABLE: { id: 0, name: "WALKABLE", img: "walkable.png" },
			UNWALKABLE: { id: 1, name: "UNWALKABLE", img: "unwalkable.png" },
			START: { id: 2, name: "START", img: "start.png" },
			END: { id: 3, name: "END", img: "end.png" },
			0: this.WALKABLE,
			1: this.UNWALKABLE,
			2: this.START,
			3: this.END
		},

		init: function( id, row, col, map ) {
			this.id = this.tiles[id];
			this.row = row;
			this.col = col;
			var bound = _.make( Game.Box ).init( map.toCoords( row, col ), map.tileLength, map.tileLength );
			this.entityInit( Game.SpriteManager.get( this.id.img ), bound );
			return this;
		}
	},

	/**
	 * Represents sprite
	 */
	Sprite: {

		/**
		 * Default properties
		 * s: source box
		 */
		img: null,
		s: null,

		init: function( img, sx, sy, sw, sh ) {
			this.img = img;
			this.s = _.make( Game.Box ).init( sx, sy, sw, sh );

			return this;
		},

		drawAt: function( ctx, dx, dy, dw, dh ) {
			var d = _.make( Game.Box ).init( dx, dy, dw, dh );

			// In case if the width and height are not specified
			d.w = d.w || this.s.w;
			d.h = d.h || this.s.h;
			ctx.drawImage( this.img, this.s.x, this.s.y, this.s.w, this.s.h, dx, dy, d.w, d.h )
		}
	},

	/**
	 * Make sprites out of data and image
	 */
	SpriteManager: {

		sprites: {},

		add: function( name ) {

			var imgSrc = Game.settings.imgRoot + name + ".png";
			var jsonSrc = Game.settings.imgRoot + name + ".json";

			var that = this;

			var spriteSheet = {
				img: null,
				data: null,
			}

			// Add asset to asset manager
			Game.AssetManager.add( imgSrc, _.make( Game.Asset ).init(
				Game.AssetManager.assetType.image,
				imgSrc,
				function( asset ) {
					spriteSheet.img = asset.content;
					that.parse( spriteSheet );
				}
			) );

			Game.AssetManager.add( jsonSrc, _.make( Game.Asset ).init(
				Game.AssetManager.assetType.json,
				jsonSrc,
				function( asset ) {
					spriteSheet.data = asset.content;
					that.parse( spriteSheet );
				}
			) );
		},

		get: function( name ) {
			return this.sprites[name];
		},

		parse: function( ss ) {
			if ( ss.img && ss.data ) {
				for ( var property in ss.data.frames ) {
					if ( ss.data.frames.hasOwnProperty( property ) ) {
						this.sprites[property] = _.make( Game.Sprite ).init(
							ss.img,
							ss.data.frames[property].frame
						);
					}
				}
			}
		}
	},

	/**
	 * Tower object
	 * Override calculateAOE to make it have Area of Effect
	 */
	Tower: {

		data: {},

		// Default properties
		damage: 0,
		range: 0,
		rate: 0,

		/**
		 * Takes a name of tower and sets damage, range, and rate accordingly
		 * tile should be part of map and is UNWALKABLE
		 */
		init: function( name, tile, x, y, w, height ) {
			this.damage = this.data[name].damage;
			this.range = this.data[name].range;
			this.rate = this.data[name].rate;

			this.entityInit( Game.SpriteManager.get( this.data[name].image ), x, y, w, height );

			return this;
		}
	},

	/**
	 * Creature object, represents Hero and Monster because they are almost the same
	 * TODO: Better name?
	 */
	Creature: {

		data: {},

		// Default properties
		health: 0,
		damage: 0,
		range: 0,
		rate: 0,
		speed: 0,

		/**
		 * Takes a type and name of the creature and sets health, damage, range, rate, and speed accordingly
		 */
		init: function( type, name, x, y, w, height ) {
			this.health = this.data[name].health;
			this.damage = this.data[name].damage;
			this.range = this.data[name].range;
			this.rate = this.data[name].rate;
			this.speed = this.data[name].speed;

			this.entityInit( Game.SpriteManager.get( this.data[name].image ), x, y, w, h );

			return this;
		}
	},

	/**
	 * Potion object
	 */
	Potion: {

		data: {},
		
		init: function( name ) {
			this.damage = this.data[name].damage;
			this.area = this.data[name].area;
			return this;
		}
	},

	/**
	 * Doomsday device object
	 */
	DoomsdayDevice: {

		data: {}
	}
} );

Game.AssetManager.add( "objects", _.make( Game.Asset ).init(
	Game.AssetManager.assetType.json,
	Game.settings.gameDataRoot + "objects.json",
	function( asset ) {
		var data = Game.settings.data = asset.content;
		Game.Tower.data = data.towers;
		Game.Creature.data.heroes = data.heroes;
		Game.Creature.data.monsters = data.monsters;
		Game.Potion.data = data.potions;
	}
) );

_.extend( Game.Tower, Game.Entity );
_.extend( Game.Creature, Game.Entity );
_.extend( Game.Potion, Game.Entity );
_.extend( Game.DoomsdayDevice, Game.Entity );

// After the game's working
// var windowResize = function() {
// 	var w = window.innerWidth - 3,
// 		h = window.innerHeight - 3,
// 		optimalW = w < h ? w : h;
// 	settings.canvas.style.width = optimalW + "px";
// 	settings.canvas.style.height = optimalW + "px";
// };
// windowResize();
// _.bind( window, "resize", windowResize );

})( window );
/*!
 * Vilify main.js file
 */

(function( window ) {

var Game = window.Game.init( document.getElementById( "canvas" ), 30 );
var settings = Game.settings;
var canvas = settings.canvas;
var ctx = settings.ctx;

// Fetch data
Game.SpriteManager.add( "tiles" );
Game.SpriteManager.add( "towers" );
Game.SpriteManager.add( "materials" );
// Game.SpriteManager.add( "monsters" );
Game.AssetManager.add( "logo.png", _.make( Game.Asset ).init(
	Game.AssetManager.assetType.image,
	"images/logo.png",
	function() {}
) );

mainFont = _.make( Game.Font ).init( 32, "Happy Monkey" );
var newGameButton = _.make( Game.Button ).init( "New Game", mainFont, 300, 300, 20, 20, "#2DB42A", "#222" );
newGameButton.click = function() {
	Game.StateManager.change( "game" );
};
Game.entities.push( newGameButton );

// Loading Screen
var startedLoading = false;
Game.StateManager.add( "loading", {
	update: function( delta ) {
		if ( !startedLoading ) { // Don't start multiple loading processes
			startedLoading = true;
			Game.AssetManager.load( function() {
				Game.StateManager.state.update();
				window.setTimeout( function() {
					Game.StateManager.change( "main_menu" );
				}, 500 );
			}, function() {} );
		}
		
		return false;
	},
	draw: function( ctx ) {
		// Draw background
		ctx.fillStyle = "#000";
		ctx.fillRect( 0, 0, canvas.width, canvas.height );

		// Draw loading bar
		ctx.lineWidth = "5";
		ctx.strokeStyle = "#2DB42A";
		ctx.fillStyle = "#2DB42A";
		ctx.strokeRect( canvas.width / 2 - 300 / 2 - 10, canvas.height / 2 - 50 / 2 - 10, 300 + 10, 50 + 10 );
		ctx.stroke();
		ctx.fillRect( canvas.width / 2 - 300 / 2 - 10 / 2, canvas.height / 2 - 50 / 2 - 10 / 2, 300 * Game.AssetManager.loadedCount / Game.AssetManager.assetCount, 50 );
		
		return false;
	}
}, true );

// TODO: Implement main menu
Game.StateManager.add( "main_menu", {
	update: function( delta ) {
		return true;
	},
	draw: function( ctx ) {
		// Draw background
		ctx.fillStyle = "#000";
		ctx.fillRect( 0, 0, canvas.width, canvas.height );

		// Draw logo
		ctx.drawImage( Game.AssetManager.assets["logo.png"].content, canvas.width / 2 - Game.AssetManager.assets["logo.png"].content.width / 2, 20 );
		
		return true;
	}
} );

// TODO: Implement game screen
Game.StateManager.add( "game", {
	update: function( delta ) {
		// Draw background
		ctx.fillStyle = "#000";
		ctx.fillRect( 0, 0, canvas.width, canvas.height );
	},
	draw: function( ctx ) {}
} );

// TODO: Implement pause
Game.StateManager.add( "pause", {
	update: function( delta ) {},
	draw: function( ctx ) {}
} );

Game.start();

})( window );
