/**
 * Handles sidebar functionailty
 */

(function( window ) {

var Game = window.Game,
	document = window.document,
	
	$sidebar = $( "#sidebar" )
	

$( "#lab" ).children().each( function() {
	$(this).data( "material", "" );
});

// Put material in lab box
function getMaterial( material ) {
	if ( $( "#lab" ).children().eq( 0 ).data( "material" ) == "" ) {
		$( "#lab" ).children().eq( 0 ).data( "material", material );
		$( "#lab" ).children().eq( 0 ).css( "background", " url(images/materials.png) " );
	}
	else if ( $( "#lab" ).children().eq( 1 ).data( "material" ) == "" ) {
		$( "#lab" ).children().eq( 1 ).data( "material", material );
		$( "#lab" ).children().eq( 1 ).css( "background", " url(images/materials.png) " );
	}
	else if ( $( "#lab" ).children().eq( 2 ).data( "material" ) == "" ) {
		$( "#lab" ).children().eq( 2 ).data( "material", material );
		$( "#lab" ).children().eq( 2 ).css( "background", " url(images/materials.png) " );
		// TODO: Add new tower code
	}
}

Game.getMaterial = getMaterial;

})( window );
