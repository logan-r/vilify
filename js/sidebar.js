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

// Change the state of the sidebar
function changeState( newState, params ) {
	$( "#lab" ).fadeOut( 1000, function() {
		switch ( newState ) {
			case "Lab":
				/**
				 * No params
				 */
				$( "#lab" ).fadeIn( 1000 );
				$( "#lab" ).children().each( function() {
					$(this).data( "material", "" ).css( "background-image", "none" );
				});
				break;
			case "Place Tower":
				/**
				 * name {String} The towers name
				 */
				$( "#place-tower" ).fadeIn( 1000 );
				$( ".preview-name" ).text( params.name );
				$( ".preview-box" ).css( "background-image", "url(images/towers/" + Game.settings.objectData.towers[params.name].image + ")" );
				break;
		}
	});
}

// Put material in lab box
function getMaterial( material ) {
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
		
		getNewItem( 
		$( "#lab" ).children().eq( 0 ).data( "material" ),
		$( "#lab" ).children().eq( 1 ).data( "material" ),
		$( "#lab" ).children().eq( 2 ).data( "material" ));
	}
}

Game.getMaterial = getMaterial;

// Get a new item
function getNewItem(m1, m2, m3) {
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
	changeState( "Place Tower", { name: towers[ item_rank - 1 ] });
}

})( window );
