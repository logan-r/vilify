/**
 * GameObject class
 * Base class for anything in the game world
 * Parent class of Item and PhysicalObject
 */
function GameObject(game, type) {
    /**
     * GameObject data/model
     */
    var model = {
        type: type
    };
    
    /**
     * GameObject sprite/view
     */
    var view = game.add.sprite(0, 0, type);
    
    // Set the sprite's anchor point to the center of the sprite
    view.anchor.setTo(0.5, 0.5);
    
    /**
     * GameObject actions/controller
     */
    var controller = {};
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "GameObject"
    };
}


/**
 * PhysicalObject class
 * Base class for any physical object in the game world
 * Parent class of Tower and AnimateObject
 */
function PhysicalObject(game, type) {
    // Inherits from GameObject
    var _superclass = GameObject(game, type);
    
    /**
     * PhysicalObject data/model
     */
    var model = _superclass.m;
    
    /**
     * PhysicalObject sprite/view
     */
    var view = _superclass.v;
    
    /**
     * PhysicalObject actions/controller
     */
    var controller = _superclass.c;
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "PhysicalObject"
    };
}


/**
 * AnimateObject class
 * Base class for any physical, moving object in the game world
 * Parent class of Projectile and FightingObject
 */
function AnimateObject(game, type) {
    // Inherits from PhysicalObject
    var _superclass = PhysicalObject(game, type);
    
    /**
     * AnimateObject data/model
     */
    var model = _superclass.m;
    
    /**
     * AnimateObject sprite/view
     */
    var view = _superclass.v;
    
    /**
     * AnimateObject actions/controller
     */
    var controller = _superclass.c;
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "AnimateObject"
    };
}


/**
 * FightingObject class
 * Base class for any physical, moving object in the game world that can enter
 * direct combat with other objects
 * Parent class of Hero and Monster
 */
function FightingObject(game, type) {
    // Inherits from AnimateObject
    var _superclass = AnimateObject(game, type);
    
    /**
     * FightingObject data/model
     */
    var model = _superclass.m;
    
    /**
     * FightingObject sprite/view
     */
    var view = _superclass.v;
    
    /**
     * FightingObject actions/controller
     */
    var controller = _superclass.c;
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "FightingObject"
    };
}