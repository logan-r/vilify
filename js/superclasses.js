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
    
    // Scale the sprite based upon the data defined in view_data
    view.scale.x = window.data.view_data[type].scale.x;
    view.scale.y = window.data.view_data[type].scale.y;
    
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
    
    // Give the animate object a velocity
    model.velocity = 0;
    
    // Give the animate object a mass
    model.mass = 0;
    
    
    /**
     * AnimateObject sprite/view
     */
    var view = _superclass.v;
    
    // Enable physics on AnimateObjects
    game.physics.arcade.enable(view);
    
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
    
    // A FightingObject's health repersents how much damage it can take
    model.health = 0;
    
    // A FightingObject's maxHealth repersent the maximum value its health can
    // reach. This FightingObjects health can not exceed its maxHealth
    model.maxHealth = 0;
    
    /**
     * FightingObject sprite/view
     */
    var view = _superclass.v;
    
    /**
     * FightingObject actions/controller
     */
    var controller = _superclass.c;
    
    // Apply damage to this object and if need be kill this object
    // amount: the amount of damage done to this object
    controller.damage = function(amount) {
        // Subtract damage away from health
        model.health = model.health - amount;
        
        // Check to see if the object is dead
        if (model.health <= 0) {
            // TODO: kill object
        }
    };
    
    // Apply healing to this object
    // amount: the amount of health the object is healed
    controller.heal = function(amount) {
        // Add healing to health
        model.health = model.health + amount;
        
        // Check to make sure the object's health does not exceed its maxHealth
        if (model.health > model.maxHealth) {
            model.health = model.maxHealth;
        }
    };
    
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