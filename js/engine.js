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
	 * @bool Game.alive
	 */
	alive: false,

	/**
	 * State-based game
	 * addState takes a String, or an Array of strings as argument.
	 * The string should be camelCase.
	 */
	states: { _count: 0 },
	state: null,
	addState: function( state ) {
		if ( state instanceof Array ) {
			for ( var i = 0; i < state.length; i++ ) {
				this._addState( state[i] );
			}
		} else {
			this._addState( state );
		}
	},
	_addState: function( state ) {
		if ( states.hasOwnProperty( state ) ) {
			throw 'this state has been already added: ' + state;
		} else {
			states[state] = states._count;
			states._count++;
		}
	},

	/**
	 * Box object constructor. Box object will define most of dimensions.
	 * @function Box
	 * @param x {Number, Vector2, Box} X value of top left corner, vector representing top left corner, Box to copy
	 * @param y {Number, Number, undefined} Y value of top left corner, width
	 * @param width {Number, Number, undefined} Width, height
	 * @param height {Number, undefined, undefined} Height
	 */
	Box: {
		init: function( x, y, width, height ) {
			if ( x instanceof window.Physics.Box ) {
				this.set( x );
			} else {
				if ( x instanceof window.Physics.Vector2 ) {
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
			return this;
		},

		/**
		 * Getters and setters
		 */
		get left() { return this.x; },
		get top() { return this.y; },
		get right() { return this.x + this.width; },
		get bottom() { return this.y + this.height; },

		get centerx() { return this.x + this.width / 2; },
		get centery() { return this.y + this.height / 2; },

		get center() { return _.make( Vector2 ).init( this.centerx, this.centery ); },
		get topLeft() { return _.make( Vector2 ).init( this.left, this.top ); },
		get topRight() { return _.make( Vector2 ).init( this.right, this.top ); },
		get bottomLeft() { return _.make( Vector2 ).init( this.left, this.bottom ); },
		get bottomRight() { return _.make( Vector2 ).init( this.right, this.bottom ); },

		get size() { return { width: this.width, height: this.height }; },

		set left( value ) { this.x = value; },
		set top( value ) { this.y = value; },
		set right( value ) { this.x = value - this.width; },
		set bottom( value ) { this.y = value - this.height; },

		set centerx( value ) { this.x = value - this.width / 2; },
		set centery( value ) { this.y = value - this.height / 2; },

		// Basically, you can put any Object with x or y value e.g. window.Physics.Vector2
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
		 * @function window.Physics.Box.prototype.set
		 * @params box {window.Physics.Box}
		 */
		set: function( box ) {
			this.topLeft = box.topLeft;
			this.size = box.size;
			return this;
		},

		/**
		 * Returns a copy
		 * @function window.Physics.Box.prototype.copy
		 * @returns {window.Physics.Box}
		 */
		copy: function() {
			return _.make( Box ).init( this.x, this.y, this.width, this.height );
		},

		/**
		 * Basic collision with other Box
		 * @function window.Physics.Box.prototype.collideWith
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
		 * @function window.Physics.Box.prototype.isPointInside
		 * @param x {Number} X value of the point
		 * @param y {Number} Y value of the point
		 * @returns {BOOL}
		 */
		isPointInside: function( x, y ) {
			return this.left < x && x < this.right &&
				this.top < y && y < this.top;
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
		init: function( x, y ) {
			if ( x.hasOwnProperty( "x" ) && x.hasOwnProperty( "y" ) ) {
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
		}
	},

	/**
	 * Starts the engine
	 * @function Game.start
	 */
	start: function() {
		if ( !this.alive ) {
			this.settings.startTime = new Date().getTime();
			setInterval( this.tick, 1000 / ( this.settings.fps || 30 ) );
			this.alive = true;
		}
	},

	/**
	 * Stops the engine
	 * @function Game.stop
	 */
	stop: function() {
		clearInterval( this.tick );
		this.alive = false;
	}
}

// TODO

})( window );
