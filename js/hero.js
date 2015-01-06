// Hero class
function Hero(game, init_type) {
    /**
     * Hero data/model
     */
    var model = {};
    
    // Categorization data
    model.type = init_type; // The type of the hero (e.g. "agent", "Inferno")

    // Combat data
    model.health; // The hero's health
    model.maxHealth; // The maximum health the hero can have
    
    // Movement data
    model.speed; // The speed at which the hero move
    
    
    /**
     * Hero sprite/view
     */
    var view = game.add.sprite(0, 0, init_type);
    
    // Set the sprite's anchor point to the center of the sprite
    view.anchor.setTo(0.5, 0.5);
    
    
    /**
     * Hero actions/controller
     */
    var controller = {};
    
    /**
     * Generate object that is an instance of this class
     */
    var _public = {
        "type": "hero",
        "m": model,
        "v": view,
        "c": controller
    }; return _public;
}