/*!
 * Abstract Game Engine
 */

(function( window ) {

if ( window.Game ) {
	// Don't include this file twice.
	return;
}

/**
 * The abstract Game object.
 * @object Game
 */
var Game = window.Game = {
	/**
	 * Holds game settings. Contains the required default settings.
	 * But additional game settings can be added based on what your
	 * game needs.
	 * @object Game.settings
	 *   @prop fps {Number} Frames per second
	 *   @prop startTime {Number} The start time in milliseconds of the game.
	 *   @prop time {Number} The elapsed time in milliseconds since the game started
	 */
	settings: {
		fps: 30,
		startTime: 0,
		time: 0
	},

	/**
	 * Holds Game assets
	 * @object Game.assets
	 */
	assets: {},

	/**
	 * Holds game entities
	 * @array Game.entities
	 */
	entities: [],
	
	/**
	 * Holds the game entities that will be destroyed this update
	 * @array Game.entities
	 */
	killList: [],

	/**
	 * True of the game is running and false if not.
	 * @bool Game.active
	 */
	active: false,

	/**
	 * Function to call each frame
	 * @function Game.tick
	 */
	tick: function() {
		Game.settings.time = new Date().getTime() - Game.settings.startTime;
		Game.update();
		Game.draw();
	},

	/**
	 * Updates the game state. Should be overridden.
	 * @function Game.update
	 */
	update: function() {
	},

	/**
	 * Draws the current game state to the canvas.
	 * Should be overridden.
	 * @function Game.draw
	 */
	draw: function() {
	},

	/**
	 * Starts the engine
	 * @function Game.start
	 */
	start: function() {
		if ( !this.active ) {
			this.settings.startTime = new Date().getTime();
			setInterval( this.tick, 1000 / ( this.settings.fps || 30 ) );
			this.active = true;
		}
	},

	/**
	 * Stops the engine
	 * @function Game.stop
	 */
	stop: function() {
		clearInterval( this.tick );
		this.active = false;
	}
};

/**
 * Box object constructor. Box object will define most of dimensions.
 * @function Game.Box
 * @param x {Number, Game.Vector2, Game.Box} X value of top left corner, vector representing top left corner, Box to copy
 * @param y {Number, Number, undefined} Y value of top left corner, width
 * @param width {Number, Number, undefined} Width, height
 * @param height {Number, undefined, undefined} Height
 */
Game.Box = function( x, y, width, height ) {
	if ( x instanceof Game.Box ) {
		this.set( x );
	} else {
		if ( x instanceof Game.Vector2 ) {
			this.topLeft = x;
			this.width = y;
			this.height = width;
		} else {
			this.x = x || 0;
			this.y = y || 0;
			this.width = width || 0;
			this.height = height || 0;
		}
	}
};

Game.Box.prototype = {
	/**
	 * Getters and setters
	 */
	get left() { return this.x; },
	get top() { return this.y; },
	get right() { return this.x + this.width; },
	get bottom() { return this.y + this.height; },

	get centerx() { return this.x + this.width / 2; },
	get centery() { return this.y + this.height / 2; },

	get center() { return new Game.Vector2( this.centerx, this.centery ); },
	get topLeft() { return new Game.Vector2( this.left, this.top ); },
	get topRight() { return new Game.Vector2( this.right, this.top ); },
	get bottomLeft() { return new Game.Vector2( this.left, this.bottom ); },
	get bottomRight() { return new Game.Vector2( this.right, this.bottom ); },

	get size() { return { width: this.width, height: this.height }; },

	set left( value ) { this.x = value; },
	set top( value ) { this.y = value; },
	set right( value ) { this.x = value - this.width; },
	set bottom( value ) { this.y = value - this.height; },

	set centerx( value ) { this.x = value - this.width / 2; },
	set centery( value ) { this.y = value - this.height / 2; },

	// Basically, you can put any Object with x or y value e.g. Game.Vector2
	// or an array e.g. [123, 284]
	set center( value ) {
		this.centerx = value.x || value[0];
		this.centery = value.y || value[1];
	},
	set topLeft( value ) {
		this.left = value.x || value[0];
		this.top = value.y || value[1];
	},
	set topRight( value ) {
		this.right = value.x || value[0];
		this.top = value.y || value[1];
	},
	set bottomLeft( value ) {
		this.left = value.x || value[0];
		this.bottom = value.y || value[1];
	},
	set bottomRight( value ) {
		this.right = value.x || value[0];
		this.bottom = value.y || value[1];
	},

	set size( value ) {
		this.width = value.width || value[0];
		this.height = value.height || value[1];
	},

	/**
	 * Set this box with another box's property
	 * @function Game.Box.prototype.set
	 * @params box {Game.Box}
	 */
	set: function( box ) {
		this.topLeft = box.topLeft;
		this.size = box.size;
		return this;
	},

	/**
	 * Returns a copy
	 * @function Game.Box.prototype.copy
	 * @returns {Game.Box}
	 */
	copy: function() {
		return new Game.Box( this.x, this.y, this.width, this.height );
	},

	/**
	 * Basic collision with other Box
	 * @function Game.Box.prototype.collideWith
	 * @param box {Box}
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
	 * Collision with a point
	 * @function Game.Box.prototype.isPointInside
	 * @param x {Number} X value of the point
	 * @param y {Number} Y value of the point
	 * @returns {BOOL}
	 */
	isPointInside: function( x, y ) {
		return this.left < x && x < this.right &&
			this.top < y && y < this.top;
	}
};

/*
 * Vector2 Object Constructor
 * It holds position or vector, either one
 * @function Game.Vector2
 * @params x {Number, Game.Vector2} X value, vector to copy
 * @params y {Number, undefined} Y value
 */
Game.Vector2 = function( x, y ) {
	if (x instanceof Game.Vector2 ) {
		this.set( x );
	} else {
		this.x = x;
		this.y = y;
	}
}

Game.Vector2.prototype = {
	/**
	 * Operations, since JavaScript doesn't have operation overloading
	 * add: Returns the sum of the two vectors
	 * sub: subtract - Returns the difference between the two vectors
	 * mul: multiply - Returns the component-wise multiplication of the vectors
	 * div: divide - Returns the component-wise division of the vectors
	 */
	add: function( other ) {
		return new Game.Vector2( this.x + other.x, this.y + other.y );
	},
	sub: function( other ) {
		return new Game.Vector2( this.x - other.x, this.y - other.y );
	},
	mul: function( other ) {
		return new Game.Vector2( this.x * other.x, this.y * other.y );
	},
	div: function( other ) {
		return new Game.Vector2( this.x / other.x, this.y / other.y );
	},

	get length() { return Math.sqrt( this.x * this.x + this.y * this.y ); },
	get angle() { return Math.atan2( this.y, this.x ); },

	/*
	 * Set this vector with other vector's property
	 */
	set: function( other ) {
		this.x = other.x;
		this.y = other.y;
		return this;
	},

	/*
	 * Returns a copy of this vector
	 */
	copy: function() {
		return new Game.Vector2( this.x, this.y );
	},

	// Returns the vector with all components multiplied by the scalar parameter
	// You would use reciprocal if you are dividing
	scale: function( scale ) {
		return new Game.Vector2( this.x * scale, this.y * scale );
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
	}
}

/**
 * Asset object constructor
 * @function Game.Asset
 * @param type {String} The asset's type (defined in Asset.types)
 * @param src {String} The file path of the asset
 */
Game.Asset = function( type, src ) {
	this.type = type;
	this.src = src;
};

/**
 * Sprite object constructor
 * @function Game.Sprite
 */
Game.Sprite = function() {

};

/**
 * Asset types
 * @object Game.Asset.types
 *   @prop image {Function} For loading image assets
 *   @prop audio {Function} For loading audio assets
 *   @prop json {Function} For loading JSON assets
 */
Game.Asset.types = {
	image: function( asset, callback ) {
		var img = new Image();
		img.onload = callback;
		img.src = asset.src;
		asset.elem = img;
	},
	audio: function( asset, callback ) {
		var audio = document.createElement( "audio" );
		audio.onload = callback;
		audio.src = asset.src;
		asset.elem = audio;
	},
	json: function( asset, callback ) {
		_.ajax( asset.src, null, function( msg ) {
			asset.elem = JSON.parse( msg );
			if ( callback ) {
				callback( asset.elem );
			}
		});
	}
};

/**
 * Loads this asset
 * @function Game.Asset.prototype.load
 * @param callback {Function, optional} A function to call when the asset is loaded
 */
Game.Asset.prototype.load = function( callback ) {
	Game.Asset.types[this.type]( this, callback );
};


/**
 * Data structure for holding and loading Asset objects
 * @function Game.AssetManager
 * @param assetSrc {Object} An object source to store added Assets to
 */
Game.AssetManager = function( assetSrc ) {
	this.assets = assetSrc || {};

	// Total and loaded assets
	this.totalAssets = 0;
	this.loadedAssets = 0;
};

Game.AssetManager.prototype = {
	/**
	 * Adds an asset to the source object
	 * @function Game.AssetManager.prototype.add
	 * @param name {String} The name of the asset
	 * @param asset {Game.Asset} The asset to be added
	 */
	add: function( name, asset ) {
		this.assets[name] = asset;
		this.totalAssets++;
	},

	/**
	 * Gets an asset
	 * @function Game.AssetManager.prototype.get
	 * @param name {String} The name of the asset
	 */
	get: function( name ) {
		return this.assets[name];
	},

	/**
	 * Checks if all assets in this asset manager have been loaded
	 * @function Game.AssetManager.prototype.loaded
	 */
	loaded: function() {
		return this.totalAssets === this.loadedAssets;
	},

	/**
	 * Loads all assets currently in the asset manager
	 * @function Game.AssetManager.prototype.load
	 * @param callback {Function} A function to call when all assets are loaded
	 */
	load: function( callback ) {
		this.callback = callback;

		var self = this,
			i;
		for ( i in this.assets ) {
			if ( this.assets.hasOwnProperty( i ) ) {
				this.assets[i].load( function() {
					self.assetLoaded();
				});
			}
		}
	},

	/**
	 * A function to call when an asset has loaded
	 * @function Game.AssetManager.prototype.assetLoaded
	 */
	assetLoaded: function() {
		this.loadedAssets++;
		if ( this.loaded() && this.callback ) {
			this.callback();
		}
	}
};

/**
 * Class for handling input event
 * @function Game.InputManager
 * @param canvas {Object} A canvas DOM element that InputManager will handle input for
 * @param offset {Object} The offset of the canvas from the top of the window
 */
Game.InputManager = function( canvas, offset ) {
	this.canvas = canvas;
	this.offset = offset || {x: 0, y: 0};
	
	// An array of events
	this.events = [];
	 
	self = this;
	
	_.bind(this.canvas, "click", function( e ){ return self.handleClick( self, e )});
};

Game.InputManager.prototype = {
	/**
	 * Handles click event
	 * @function Game.InputManager.prototype.handleClick
	 * @param e {Object} The event to be handled
	 */
	handleClick: function( self, e ) {
		
		x_offset = self.offset.x;
		y_offset = self.offset.y;
		
		var event = {
			x: e.pageX - x_offset,
			y: e.pageY - y_offset
		}
		
		self.events.push( event );
		
		return false;
	},
	/**
	 * Checks what entities got clicked and clears events
	 * @function Game.InputManager.prototype.unload
	 * @param entities {Game.Entity[]} The entities to check for collision
	 * @param ctx {Object} A canvas context
	 */
	unload: function( entities, ctx ) {
		if (this.events.length > 0 ) {
			event = this.events[0];
			for ( i = 0, n = entities.length; i < n; i++ ) {
				if ( entities[i].collides( event, ctx )) {
					entities[i].clicked();
				}
			}
			this.events = [];
		}
	},
	/**
	 * Checks if/what (a) tile has been click on the map. Assumes whole canvas is map. Returns {Number[]} x, y tile location or false.
	 * @function Game.InputManager.prototype.unloadToMap
	 * @param tileWidth {Number} The width per tile
	 * @param tileHeight {Number} The height per tile
	 */
	unloadToMap: function ( tileWidth, tileHeight ) {
		if (this.events.length > 0 ) {
			event = this.events[0];
			tile = [ parseInt( event.x / tileWidth ), parseInt( event.y / tileHeight ) ];
			this.events = [];
			return tile;
		}
		return false;
	}
};

/**
 * Abstract class for representing an entity in the game.
 * This should never be invoked on its own.
 * @function Game.Entity
 * @param type {Array} The objects category and name
 * @param dimension {Object} Contains the x, y, width, and height of the entity
 * @param img {Image} The entity's image
 * @param spriteData {Object} Location of the image in the sprite
 */
Game.Entity = function( type, dimension, img, spriteData ) {
	if ( type ) {
		this.category = type[0];
		this.name = type[1];
	}
	if ( dimension ) {
		this.x = dimension.x;
		this.y = dimension.y;
		this.width = dimension.width;
		this.height = dimension.height;
	}
	this.img = img;
	this.spriteData = spriteData;
	this.angle = 0;
};

Game.Entity.prototype = {
	/**
	 * Updates the entity
	 * @function Game.Entity.prototype.update
	 */
	update: function() {
	},

	/**
	 * Draws the entity to the canvas
	 * @function Game.Entity.prototype.draw
	 * @param ctx {Object} A canvas context
	 */
	draw: function( ctx ) {
		if ( this.img ) {
			ctx.save();
			
			ctx.translate( this.x, this.y );
			
			// Rotate the image
			if ( this.angle ) {
				ctx.rotate( this.angle );
			}
			
			// Draw the image
			ctx.drawImage( this.img, this.spriteData.x, this.spriteData.y, this.spriteData.w, this.spriteData.h, -this.width / 2, -this.height / 2, this.width, this.height );
			
			ctx.restore();
		} else {
			// Set color
			ctx.fillStyle = "black";			
			
			ctx.save();						
			
			ctx.translate( this.x, this.y );
			
			// Rotate the image
			if ( this.angle ) {
				ctx.rotate( this.angle );
			}
			
			// Draw the image
			ctx.fillRect( -this.width / 2, -this.height / 2, this.height, this.width );
			
			ctx.restore();
		}
	},
	
	/**
	 * Checks if point collides with entity
	 * @function Game.Entity.prototype.collide
	 * @param point {Object} A point on the canvas
	 * @param ctx {Object} A canvas context
	 */
	collides: function( point, ctx ) {
		// Get corners
		top_left     = [ -1 * this.width/2, -1 * this.height/2 ];
		top_right    = [ this.width/2, -1 * this.height/2 ];
		bottom_right = [ this.width/2, this.height/2 ];
		bottom_left  = [ -1 * this.width/2, this.height/2 ];
		
		if ( this.angle ) {
			// Rotate corners
			top_left     = [top_left[0] * Math.cos( this.angle ) - top_left[1] * Math.sin( this.angle ),
					top_left[0] * Math.sin( this.angle ) + top_left[1] * Math.cos( this.angle )];
			
			top_right    = [top_right[0] * Math.cos( this.angle ) - top_right[1] * Math.sin( this.angle ),
					top_right[0] * Math.sin( this.angle ) + top_right[1] * Math.cos( this.angle )];
			
			bottom_right = [bottom_right[0] * Math.cos( this.angle ) - bottom_right[1] * Math.sin( this.angle ),
					bottom_right[0] * Math.sin( this.angle ) + bottom_right[1] * Math.cos( this.angle )];
			
			bottom_left  = [bottom_left[0] * Math.cos( this.angle ) - bottom_left[1] * Math.sin( this.angle ),
					bottom_left[0] * Math.sin( this.angle ) + bottom_left[1] * Math.cos( this.angle )];
		}
		
		// Save context state
		ctx.save();
		
		// Move to entity position
		ctx.translate( this.x, this.y );
		
		// Trace entity
		ctx.beginPath();
		ctx.moveTo( top_left[0], top_left[1] );
		ctx.lineTo( top_right[0], top_right[1] );
		ctx.lineTo( bottom_right[0], bottom_right[1] );
		ctx.lineTo( bottom_left[0], bottom_left[1] );
		ctx.closePath();
		
		// Check collision
		result = ctx.isPointInPath(point.x, point.y);
		
		// Restore context state
		ctx.restore();
		
		return result;
	},
	
	/**
	 * Called when entity clicked
	 * @function Game.Entity.prototype.clicked
	 */
	clicked: function() {
		console.log( this.name );
	}
};

/**
 * The default AssetManager for your Game (you can create
 * more if needed).
 * @object {Game.AssetManager} Game.assetManager
 */
Game.assetManager = new Game.AssetManager( Game.assets );

})( window );
