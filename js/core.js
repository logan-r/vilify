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
