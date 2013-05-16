/*!
 * Vilify Core
 */

(function( window ) {

var Game = window.Game;

_.deepCopy( Game, {

	name: "Vilify",
	version: "1.0.0",

	settings: {
		fps: 30,
		map: null,
		sidebar: null
	},

	Tile: {

		/**
		 * The tiles of Vilify
		 */
		tiles: {
			WALKABLE: { id: 0, name: "WALKABLE" },
			UNWALKABLE: { id: 1, name: "UNWALKABLE" },
			START: { id: 2, name: "START" },
			END: { id: 3, name: "END" }
		}
	},

	/**
	 * Represents sprite
	 */
	Sprite: {

		/**
		 * Default properties
		 * s-: source property
		 */
		img: null,
		sx: 0,
		sy: 0,
		sWidth: 0,
		sHeight: 0,

		init: function( img, sx, sy, sWidth, sHeight ) {
			this.img = img;
			if ( Game.Box.canBeBox( sx ) ) {
				this.xy = sx.y;
				this.sWidth = sx.width;
				this.sHeight = sx.height;
				this.sx = sx.x;
			} else {
				this.sx = sx;
				this.sy = sy;
				this.sWidth = sWidth;
				this.sHeight = sHeight;
			}
		},

		drawAt: function( ctx, dx, dy, dWidth, dHeight ) {
			if ( Game.Box.canBeBox( dx ) ) {
				dy = dx.y;
				dWidth = dx.width;
				dHeight = dx.height;
				dx = dx.x;
			}

			// In case if the width and height are not specified
			dWidth = dWidth || sWidth;
			dHeight = dHeight || sHeight;
			ctx.drawImage( img, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight )
		}
	},

	/**
	 * SpriteSheet object
	 */
	SpriteSheet: {

		// Default properties
		img: null,
		data: null,
		parsed: false,
		sprites: {},

		parse: function() {
			for ( var property in this.data.frames ) {
				if ( this.data.frames.hasOwnProperty( property ) ) {
					this.sprites[property] = _.make( Game.Sprite ).init(
						this.img,
						this.data.frames[property].frame
					);
				}
			}
		}
	},

	/**
	 * Make sprites out of data and image
	 */
	SpriteHelper: {

		spriteSheets: {},
		sprites: {},

		addSpriteSheet: function( name, imgSrc, jsonSrc ) {

			if ( this.spriteSheets[name] ) {
				throw "SpriteHelper: SpriteSheet with this name already exists";
			}

			var that = this;

			var spriteSheet = _.make( Game.SpriteSheet );
			this.spriteSheets[name] = spriteSheet;

			// Add asset to asset manager
			var imgAsset = _.make( Game.Asset ).init(
				Game.AssetManager.assetType.image,
				imgSrc,
				function( asset ) {
					spriteSheet.img = asset.content;
					spriteSheet.parse();
				}
			);

			var jsonAsset = _.make( Game.Asset ).init(
				Game.AssetManager.assetType.json,
				jsonSrc,
				function( asset ) {
					spriteSheet.data = asset.content;
					spriteSheet.parse();
				}
			);
		}
	}
} );

// TODO

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
