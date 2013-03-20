/**
 * Handles sidebar functionailty
 */

(function( window ) {

var Game = window.Game,
	document = window.document,
	
	$sidebar = $( "#sidebar" )
	
	// Put material in lab box
	$( "#lab" ).children().eq( 0 ).css( "background", "grey url( image_url_here )" );
	
	// Put potions/towers/monsters in inventory boxes
	$( "#inventory" ).children().eq( 0 ).children().eq( 0 ).css( "background", "grey url( image_url_here )" );
	$( "#inventory" ).children().eq( 0 ).children().eq( 1 ).css( "background", "grey url( image_url_here )" );

})( window );
