/**
 * GameObject class
 * Base class for anything in the game world
 * Parent class of Item and PhysicalObject
 * 
 * @params
 * game: an instance of the overarching phaser game
 * type: the type of the object (e.g. "soldier", "robot", etc.)
 * pos: an object in the form {x: _, y: _} that specifies the initial position
 *      of the object
 */
function GameObject(game, type, pos) {
    /**
     * GameObject actions/controller
     */
    var controller = {};
    
    // Update the GameObject - performed on every tick of the game's clock
    controller.update = function() {
        // Each subclass should override this
    };
    
    // Removes the object from the game world
    // TODO: Look into using phaser's .kill() method instead of .destroy() for optimization
    controller.destroy = function() {
        // Stop rendering view
        view.destroy();
    };
    
    /**
     * GameObject data/model
     */
    var model = {
        type: type
    };
    
    // If data exists about this type of object in the global model_data
    // load that data into the model
    if (window.data.model_data.hasOwnProperty(type)) {
        for (var property in window.data.model_data[type]) {
            if (window.data.model_data[type].hasOwnProperty(property)) {
                model[property] = window.data.model_data[type][property];
            }
        }
    }
    
    // If data exists about this type of object in the global view_data
    // load that data into the model's viewInfo property
    if (window.data.view_data.hasOwnProperty(type)) {
        model.viewInfo = {};
        for (var property in window.data.view_data[type]) {
            if (window.data.view_data[type].hasOwnProperty(property)) {
                model.viewInfo[property] = window.data.view_data[type][property];
            }
        }
    }
    
    /**
     * GameObject sprite/view
     */
    var view = game.add.sprite(pos.x, pos.y, type);
    
    // Set the sprite's anchor point to the center of the sprite
    view.anchor.setTo(0.5, 0.5);
    
    // Scale the sprite based upon the data defined in view_data
    view.scale.x = window.data.view_data[type].scale.x;
    view.scale.y = window.data.view_data[type].scale.y;
    
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
function PhysicalObject(game, type, pos) {
    // Inherits from GameObject
    var _superclass = GameObject(game, type, pos);
    
    /**
     * PhysicalObject data/model
     */
    var model = _superclass.m;
    
    // The place the object is trying to reach
    model.destination = null; // Overriden by subtypes
    
    /**
     * PhysicalObject sprite/view
     */
    var view = _superclass.v;
    
    // Enable physics on all PhysicalObjects
    game.physics.arcade.enable(view);
    
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
function AnimateObject(game, type, pos) {
    // Inherits from PhysicalObject
    var _superclass = PhysicalObject(game, type, pos);
    
    /**
     * AnimateObject data/model
     */
    var model = _superclass.m;
    
    // Give the animate object a mass
    model.mass = 0;
    
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
function FightingObject(game, type, pos) {
    // Inherits from AnimateObject
    var _superclass = AnimateObject(game, type, pos);
    
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
    
    // Don't allow fighting objects to go off screen
    view.body.collideWorldBounds = true;
    
    view.body.velocity.x = model.velocity;
    
    view.animations.add("move", model.viewInfo.animations.move, 20, true);
    
    view.animations.play("move");
    
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