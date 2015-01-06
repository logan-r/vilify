// Monster class
function Monster(game, init_type) {
    /**
     * Monster data/model
     */
    var model = {};
    
    // Categorization data
    model.type = init_type; // The type of the monster (e.g. "alien warlord", "scrapyard robot")

    // Combat data
    model.health; // The monster's health
    model.maxHealth; // The maximum health the monster can have
    
    // Movement data
    model.speed; // The speed at which the monster move
    
    
    /**
     * Monster sprite/view
     */
    var view = game.add.sprite(0, 0, init_type);
    
    // Set the sprite's anchor point to the center of the sprite
    view.anchor.setTo(0.5, 0.5);
    
    
    /**
     * Monster actions/controller
     */
    var controller = {};
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        "m": model,
        "v": view,
        "c": controller,
        type: "Monster"
    };
}