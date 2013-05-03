/*!
 * Math and physics functions used in the game
 */

(function( window ) {

/**
 * Utility functions
 */
window._ = {
	/**
	 * AJAX function to get resources
	 * uri: The uri of the resource
	 * settings:
	 *   method: Method of request ("GET" or "POST")
	 *   data: A map of data to be sent to the server
	 *   type: Response text type
	 * callback: A function to call when a response is recieved
	 */
	ajax: function( uri, options, callback ) {
		options = options || {};

		// Create xhr object
		var xhr = new XMLHttpRequest();

		xhr.open( options.method || "GET", uri );

		// If type is undefined
		if ( options.type ) {
			xhr.responseType = options.type;
		}

		xhr.onload = function() {
			if ( typeof callback === "function" ) {
				callback( xhr.responseText, xhr );
			}
		};

		if ( options.data ) {
			return xhr.send(options.data);
		}
		xhr.send();
	},

	/**
	 * Binds an event listener to an element
	 * elem: The element
	 * type: The type of event (i.e. "click")
	 * fn: The function to call when the event fires
	 */
	bind: function( elem, type, fn ) {
		elem.addEventListener( type, fn, false );
	}
};

/**
 * Extra math functions (not already in Math object)
 */
window.MathEx = {
	/**
	 * Generates a random number between low and high, inclusive.
	 */
	randInt: function( low, high ) {
		return Math.floor( Math.random() * ( high - low + 1 ) ) + low;
	},
	/**
	 * Degrees to Radians conversion
	 */
	toRad: function( degrees ) {
		return degrees * Math.PI / 180;
	},
	/**
	 * Radians to Degrees conversion
	 */
	toDeg: function( radian ) {
		return radian * 180 / Math.PI;
	}
};

/**
 * Physics utilities
 */
window.Physics = {

	/**
	 * Box object constructor. Box object will define most of dimensions.
	 * @function window.Physics.Box
	 * @param x {Number, window.Physics.Vector2, window.Physics.Box} X value of top left corner, vector representing top left corner, Box to copy
	 * @param y {Number, Number, undefined} Y value of top left corner, width
	 * @param width {Number, Number, undefined} Width, height
	 * @param height {Number, undefined, undefined} Height
	 */
	Box: function( x, y, width, height ) {
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
	},

	/*
	 * Vector2 Object Constructor
	 * It holds position or vector, either one
	 * @function window.Physics.Vector2
	 * @params x {Number, window.Physics.Vector2} X value, vector to copy
	 * @params y {Number, undefined} Y value
	 */
	Vector2: function( x, y ) {
		if (x instanceof window.Physics.Vector2 ) {
			this.set( x );
		} else {
			this.x = x;
			this.y = y;
		}
	}

};

window.Physics.Box.prototype = {
	/**
	 * Getters and setters
	 */
	get left() { return this.x; },
	get top() { return this.y; },
	get right() { return this.x + this.width; },
	get bottom() { return this.y + this.height; },

	get centerx() { return this.x + this.width / 2; },
	get centery() { return this.y + this.height / 2; },

	get center() { return new window.Physics.Vector2( this.centerx, this.centery ); },
	get topLeft() { return new window.Physics.Vector2( this.left, this.top ); },
	get topRight() { return new window.Physics.Vector2( this.right, this.top ); },
	get bottomLeft() { return new window.Physics.Vector2( this.left, this.bottom ); },
	get bottomRight() { return new window.Physics.Vector2( this.right, this.bottom ); },

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
		return new window.Physics.Box( this.x, this.y, this.width, this.height );
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
};

window.Physics.Vector2.prototype = {
	/**
	 * Operations, since JavaScript doesn't have operation overloading
	 * add: Returns the sum of the two vectors
	 * sub: subtract - Returns the difference between the two vectors
	 * mul: multiply - Returns the component-wise multiplication of the vectors
	 * div: divide - Returns the component-wise division of the vectors
	 */
	add: function( other ) {
		return new window.Physics.Vector2( this.x + other.x, this.y + other.y );
	},
	sub: function( other ) {
		return new window.Physics.Vector2( this.x - other.x, this.y - other.y );
	},
	mul: function( other ) {
		return new window.Physics.Vector2( this.x * other.x, this.y * other.y );
	},
	div: function( other ) {
		return new window.Physics.Vector2( this.x / other.x, this.y / other.y );
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
		return new window.Physics.Vector2( this.x, this.y );
	},

	// Returns the vector with all components multiplied by the scalar parameter
	// You would use reciprocal if you are dividing
	scale: function( scale ) {
		return new window.Physics.Vector2( this.x * scale, this.y * scale );
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

})( window );