/**
 * Handles sidebar functionailty
 */

(function( window ) {

var Game = window.Game,
	document = window.document,
	$sidebar = $( "#sidebar" );

// Set up
$( "#place-tower" ).hide();
$( "#lab" ).children().each( function() {
	$(this).data( "material", "" );
});

// Create new sidebar object
Game.Sidebar = {
	// Current state of Game.Sidebar
	state: "Lab",
	stateData: {},
	
	// Does the sidebar need a tile to be selected? (e.g. where to place a tower)
	needTile: false,

	// Change the state of the sidebar
	changeState: function( newState, params ) {
		$( "#place-tower, #inventory, #lab" ).hide().promise().done( function() {
			switch ( newState ) {
				case "Lab":
					/**
					 * No params
					 */
					Game.Sidebar.state = "Lab";
					Game.Sidebar.stateData = params;
					$( "#lab" ).fadeIn( 100 );
					$( "#inventory" ).fadeIn( 100 );
					$( "#lab" ).children().each( function() {
						$(this).data( "material", "" ).css( "background-image", "none" );
					});
					break;
				case "Place Tower":
					/**
					 * name {String} The towers name
					 * rank {Number} The towers rank
					 */
					Game.Sidebar.state = "Place Tower";
					Game.Sidebar.stateData = params;
					Game.Sidebar.needTile = true;
					$( "#place-tower" ).fadeIn( 100 );
					$( ".preview-name" ).text( params.name );
					$( ".preview-box" ).css( "background-image", "url(images/towers/" + Game.settings.objectData.towers[params.name].image + ")" );
					$( ".rank" ).text( params.rank + "/8" );
					break;
			}
		});
	},

	// Put material in lab box
	getMaterial: function( material ) {
		if ( $( "#lab" ).children().eq( 0 ).data( "material" ) == "" ) {
			$( "#lab" ).children().eq( 0 ).data( "material", material );
			$( "#lab" ).children().eq( 0 ).css( "background-image", "url(images/materials.png)" );
		}
		else if ( $( "#lab" ).children().eq( 1 ).data( "material" ) == "" ) {
			$( "#lab" ).children().eq( 1 ).data( "material", material );
			$( "#lab" ).children().eq( 1 ).css( "background-image", "url(images/materials.png)" );
		}
		else if ( $( "#lab" ).children().eq( 2 ).data( "material" ) == "" ) {
			$( "#lab" ).children().eq( 2 ).data( "material", material );
			$( "#lab" ).children().eq( 2 ).css( "background-image", "url(images/materials.png)" );

			this.getNewItem( 
			$( "#lab" ).children().eq( 0 ).data( "material" ),
			$( "#lab" ).children().eq( 1 ).data( "material" ),
			$( "#lab" ).children().eq( 2 ).data( "material" ));
		}
	},

	// Get a new item
	getNewItem: function(m1, m2, m3) {
		// Get the total values of the materials
		material_value  = Game.settings.objectData.materials[m1].value;
		material_value += Game.settings.objectData.materials[m2].value;
		material_value += Game.settings.objectData.materials[m3].value;

		// Make it from 1 to 16
		material_value += MathEx.randInt( 1, 4 );
		material_value -= 3;

		// Get the item rank
		item_rank = 1;

		// Chance of getting better or worse item
		chance = MathEx.randInt( 1, 100 );

		if ( material_value == 1 ) {
			item_rank = 1;
		}
		else if ( material_value == 16 ) {
			item_rank = 8;
		}
		else if ( material_value % 2 == 0 ) {
			item_rank = material_value / 2;
			if ( chance <= 33 ) {
				item_rank += 1;
			}
		}
		else {
			item_rank = ( material_value - 1 ) / 2;
			if ( chance > 33 ) {
				item_rank += 1;
			}
		}
		towers = [ "Basic Tower", "Laser Tower", "Dust Tower", "Ice Tower", "Flame Tower", "Poison Tower", "Lightning Tower", "Curse Tower" ]
		this.changeState( "Place Tower", { name: towers[ item_rank - 1 ], rank: item_rank });
	},

	// If Game.Sidebar needs a tile (e.g. for placing a tower) this function should be called when one is found
	giveTile: function( tile ) {
		if ( this.state == "Place Tower" ) {
			if ( Game.settings.map.layout[tile[1]][tile[0]] == Game.settings.tiles.UNWALKABLE ) {
				this.needTile = false;
				Game.entities.push( new Game.Tower( Game.Sidebar.stateData.name, { x: 64 * tile[0] + 32, y: 64 * tile[1] + 32, width: 64, height: 64 } ) );
				this.changeState( "Lab" );
			}
		}
	}
}

})( window );
