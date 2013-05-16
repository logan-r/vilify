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
		sidebar: null,
		imgRoot: "images/",
		gameDataRoot: "game_data/"
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
			this.entityInit( Game.SpriteHelper.get( this.id.img ), bound );
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
		},

		drawAt: function( ctx, dx, dy, dw, dh ) {
			var d = _.make( Game.Box ).init( dx, dy, dw, dh );

			// In case if the width and height are not specified
			d.w = d.w || this.s.w;
			d.h = d.h || this.s.h;
			ctx.drawImage( img, this.s.x, this.s.y, this.s.w, this.s.h, dx, dy, d.w, d.h )
		}
	},

	/**
	 * Make sprites out of data and image
	 */
	SpriteHelper: {

		sprites: {},

		add: function( imgSrc, jsonSrc ) {

			var that = this;

			var spriteSheet = {
				img: null,
				data: null,
			}

			// Add asset to asset manager
			var imgAsset = _.make( Game.Asset ).init(
				Game.AssetManager.assetType.image,
				imgSrc,
				function( asset ) {
					spriteSheet.img = asset.content;
					that.parse( spriteSheet );
				}
			);

			var jsonAsset = _.make( Game.Asset ).init(
				Game.AssetManager.assetType.json,
				jsonSrc,
				function( asset ) {
					spriteSheet.data = asset.content;
					that.parse( spriteSheet );
				}
			);
		},

		get: function( name ) {
			return this.sprites[name];
		}

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
