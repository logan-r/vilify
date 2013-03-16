/**
 * Vilify's Game Engine file
 */
 
(function( window ) {

/**
 * Holds game assets (images, music, etc.) and makes sure they are all
 * loaded before the game starts.
 */
function AssetManager() {
	// Holds assets objects
	// asset:
	//   type: The type of the asset (i.e. "image")
	//   src: The file path of the asset
	this.assets = {};

	// Store the total assets so we know when it is done loading
	this.totalAssets = 0;

	// Store the currently loaded assets so we know when it is done loading
	this.loadedAssets = 0;
};

AssetManager.prototype = {
	/**
	 * Different types of assets require different ways of loading them
	 */
	type: {
		image: function( assetManager, asset, callback ) {
			var img = new Image();
			img.onload = function() {
				if ( callback ) {
					callback();
				}
				AssetManager.prototype.assetLoaded.call( assetManager );
			};
			img.src = asset.src;
			asset.elem = img;
		},
		audio: function( assetManager, asset, callback ) {
			var audio = document.createElement( "audio" );
			audio.onload = function() {
				if ( callback ) {
					callback();
				}
				AssetManager.prototype.assetLoaded.call( assetManager );
			};
			audio.src = asset.src;
			asset.elem = audio;
		},
		// JSON data needed before the game starts is an asset and should
		// be loaded through this class
		json: function( assetManager, asset, callback ) {
			ajax( asset.src, null, function( msg ) {
				asset.elem = JSON.parse( msg );
				if ( callback ) {
					callback( asset.elem );
				}
				AssetManager.prototype.assetLoaded.call( assetManager );
			});
		}
	},

	/**
	 * Adds an asset
	 * name: Name of the asset
	 * type: Type of the asset (specified above)
	 * src: The file path of the asset
	 * callback: A function to call when this individual asset is loaded
	 */
	addAsset: function( name, type, src, callback ) {
		this.assets[name] = {
			type: type,
			src: src,
			callback: callback
		};
		this.totalAssets++;
	},

	/**
	 * Check if all assets are loaded
	 */
	isLoaded: function() {
		return this.totalAssets === this.loadedAssets;
	},

	/**
	 * Called when an asset is loaded
	 */
	assetLoaded: function() {
		this.loadedAssets++;
		if ( this.isLoaded() && this.loadedFn ) {
			this.loadedFn();
		}
	},

	/**
	 * Loads the assets
	 */
	load: function( callback ) {
		// Call the callback function when all assets are loaded
		this.loadedFn = callback;

		// Loop through assets
		for ( var asset in this.assets ) {
			// Make sure property is from assets not object
			if ( this.assets.hasOwnProperty( asset ) ) {
				// Call the appropriate loading function for the type of asset
				this.type[this.assets[asset].type]( this, this.assets[asset], this.assets[asset].callback );
			}
		}
	},

	/**
	 * Get an asset by name
	 */
	getAsset: function( assetName ) {
		return this.assets[assetName];
	}
};

window.AssetManager = AssetManager;

/**
 * Abstract class for representing an entity in the game.
 * This should never be invoked on its own.
 */
function Entity( name, dimension, spriteSheet, spriteData ) {
	/*
	 * update: stub method for update. Override recommended
	 * draw: stub method for draw. Override recommended
	 * name: the name of the entity
	 * dimension: the dimensions of the entity
	 * spriteSheet: the sprite sheet Image object in which the sprite is located
	 * spriteData: where the image is located in it's sprite sheet
	 */
	this.name = name;
	if ( dimension ) {
		this.x = dimension.x;
		this.y = dimension.y;
		this.width = dimension.width;
		this.height = dimension.height;
	}
	this.spriteSheet = spriteSheet;
	this.spriteData = spriteData;
	this.rotation = 0;
}

Entity.prototype = {
	/**
	 * Stub method for updating the entity. This method should be overrided.
	 */
	update: function( elapsed ) {
		
	},

	/**
	 * Stub method for drawing the entity. This method should be overrided.
	 */
	draw: function() {
		if ( this.spriteSheet ) {
			if ( this.rotation ) {
				// Save stage state
				stage.save();
				
				// Move to center of image
				stage.translate( this.x + this.width / 2 , this.y + this.height / 2 );
				
				// Rotate
				stage.rotate( this.rotation );
				
				// Draw image
				stage.drawImage( this.spriteSheet, this.spriteData.x, this.spriteData.y, this.width, this.height, -this.width / 2, -this.height / 2, this.width, this.height );
				
				// Restore stage state
				stage.restore();
			}
			else {
				stage.drawImage( this.spriteSheet, this.spriteData.x, this.spriteData.y, this.width, this.height, this.x, this.y, this.width, this.height );
			}
		}
		else {
			stage.fillStyle = "red";
			stage.fillRect( this.x, this.y, this.width, this.height );
		}
	}
};

window.Entity = Entity;

// Global functions

/**
 * AJAX function to get resources
 * uri: The uri of the resource
 * settings:
 *   method: Method of request ("GET" or "POST")
 *   data: A map of data to be sent to the server
 *   type: Response text type
 * callback: A function to call when a response is recieved
 */
function ajax( uri, options, callback ) {
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
}

window.ajax = ajax;

/**
 * Binds an event listener to an element
 * elem: The element
 * type: The type of event (i.e. "click")
 * fn: The function to call when the event fires
 */
function bind( elem, type, fn ) {
	elem.addEventListener( type, fn, false );
}

window.bind = bind;

})( window );
