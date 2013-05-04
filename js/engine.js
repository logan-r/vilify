/*!
 * Abstract Game Engine
 */

(function( window ) {

if ( window.Game ) {
	// Don't include this file twice.
	return;
}

var Game = window.Game = {
	/**
	 * Holds game settings. Contains the required default settings.
	 * But additional game settings can be added based on what your
	 * game needs.
	 * @object Game.settings
	 *   @prop fps {Number} Frames per second
	 *   @prop startTime {Number} The start time in milliseconds of the game.
	 *   @prop time {Number} The elapsed time in milliseconds since the game started
	 */
	settings: {
		fps: 30,
		startTime: 0,
		time: 0
	},

	/**
	 * Holds Game assets
	 * @object Game.assets
	 */
	assets: {},

	/**
	 * Holds game entities
	 * @array Game.entities
	 */
	entities: [],
	
	/**
	 * Holds the game entities that will be destroyed this update
	 * @array Game.entities
	 */
	killList: [],

	/**
	 * State-based game
	 */
	states: { _count: 0 },
	state: null,
	addState: function( state ) {
		if ( states.hasOwnProperty( state ) ) {
			throw 'this state has been already added: ' + state;
		} else {
			states[state] = states._count;
			states._count++;
		}
		return this;
	}
}

// TODO

})( window );
