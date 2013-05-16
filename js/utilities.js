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
	},

	// This one is used for making objects out of "blueprint"
	make: function( parent ) {
		// if no `parent` provided, make a substitute delegate ancestor
		// with default object
		// well, it shouldn't be called without `parent` anyway.
		if ( !parent ) {
			parent = Object.create( {} );
		}
		var obj = Object.create( parent );
		
		// impart a `__proto__` if one doesn't exist on this object
		if ( !( "__proto__" in obj ) || _.make.__proto_needed__ ) {
			// try to use ES5 if possible
			if ( Object.defineProperty ) {
				Object.defineProperty( obj, "__proto__", {
					enumerable: false,
					value: parent || null
				} );
			} else {
				obj.__proto__ = parent || null;
			}
		}
		
		return obj;
	},

	/*
	 * This one is used for "subclassing" or assigning prototype
	 * In other word, creating prototype chain without changing any property
	 * It is unnecessary and inefficient to create another object.
	 */
	extend: function( child, parent ) {
		if ( !child || !parent) {
			throw "_.extend: Argument error";
		}
		child.__proto__ = parent;
		return child;
	},

	/*
	 * This deeply copies properties of src to dest.
	 * Use it when you don't need prototype chain.
	 * Beware that this function doesn't create new object.
	 * Instead it adds properties to dest
	 */
	deepCopy: function( dest, src ) {
		for ( var item in src ) {
			if ( src[item] && src[item].constructor &&
				src[item].constructor === Object ) {
				dest[item] = dest[item] || {};
				arguments.callee( dest[item], src[item] );
			} else {
				dest[item] = src[item];
			}
		}
		return dest;
	}
};

window._.make.__proto_needed__ = !( "__proto__" in {} ); // FT for non __proto__ engines

// non-ES5 polyfill for `Object.getPrototypeOf(..)`
if ( !Object.getPrototypeOf ) {
	Object.getPrototypeOf = function( obj ) {
		return obj.__proto__ || null;
	};
}

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

})( window );