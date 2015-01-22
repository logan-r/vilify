/**
 * GameObject class
 * Base class for anything in the game world
 * Parent class of Item, Effect & PhysicalObject
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
    
    // Sets the GameObject's velocity so that it moves towards its destination
    // if it has one
    controller.moveToDestination = function() {
        // If GameObject has a destination - move towards it
        if (model.destination !== null) {
            // Check if object has reached its destination
            if (view.x == model.destination.x && view.y == model.destination.y) {
                // If so then stop moving
                model.destination = null;
            } else {
                // Move at model.velocity pixel per second
                var duration = (game.physics.arcade.distanceToXY(view, model.destination.x, model.destination.y) / model.velocity) * 1000;
                
                // Tween items to inventory
                game.add.tween(view).to(model.destination, duration, Phaser.Easing.Linear.None, true);
            }
        }
    };
    
    // Update the GameObject - performed on every tick of the game's clock
    controller.update = function() {
        // Each subclass should override this
    };
    
    // Updates the GameObject's destination to a new location
    controller.setDestination = function(dest) {
        model.destination = dest;
        
        // Clone the object
        model.previousDestination = JSON.parse(JSON.stringify(dest));
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
    
    // The location the object is trying to reach
    model.destination = null; // Overriden by subtypes
    
    // The last destination the object had
    model.previousDestination = null; // Overriden by subtypes
    
    /**
     * Load data
     */
    
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
    
    // Move the sprite's location based upon it's offset
    if (model.viewInfo.hasOwnProperty("offset")) {
        
        if (model.viewInfo.scale.hasOwnProperty("y")) {
            pos.y = pos.y + model.viewInfo.offset.y;
        }
    }
    
    var view = game.add.sprite(pos.x, pos.y, model.viewInfo.image);
    
    // Set the sprite's anchor point
    if (model.viewInfo.hasOwnProperty("anchor")) {
        view.anchor.setTo(model.viewInfo.anchor.x, model.viewInfo.anchor.y);
    } else {
        // By default set the sprite's anchor point to the center-bottom of the sprite
        view.anchor.setTo(0.5, 1);
    }
    
    // Scale the sprite based upon the data defined in view_data
    if (model.viewInfo.hasOwnProperty("scale")) {
        if (model.viewInfo.scale.hasOwnProperty("x")) {
            view.scale.x = model.viewInfo.scale.x;
        }
        
        if (model.viewInfo.scale.hasOwnProperty("y")) {
            view.scale.y = model.viewInfo.scale.y;
        }
    }
    
    // Is the sprite visible?
    if (model.viewInfo.hasOwnProperty("visible")) {
        view.visible = model.viewInfo.visible;
    } else {
        // Defaults to true
        view.visible = true;
    }
    
    // Tint the sprite
    if (model.viewInfo.hasOwnProperty("tint")) {
        view.tint = model.viewInfo.tint;
    }
    
    // Enable physics for all GameObjects
    game.physics.arcade.enable(view);
    
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
 * Parent class of Tower, InteractiveObject & AnimateObject
 */
function PhysicalObject(game, type, pos) {
    // Inherits from GameObject
    var _superclass = GameObject(game, type, pos);
    
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
 * InteractiveObject class
 * Repesents an object in the game world that the player can interact with
 */
function InteractiveObject(game, type, pos) {
    // Inherits from PhysicalObject
    var _superclass = PhysicalObject(game, type, pos);
    
    /**
     * InteractiveObject data/model
     */
    var model = _superclass.m;
    
    /**
     * InteractiveObject sprite/view
     */
    var view = _superclass.v;
    
    /**
     * InteractiveObject actions/controller
     */
    var controller = _superclass.c;
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "InteractiveObject"
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
    
    // A FightingObject's maxHealth repersent the maximum value its health can
    // reach. This FightingObjects health can not exceed its maxHealth
    model.maxHealth = model.health;
    
    // Save the intial velocity the object is traveling at for future reference
    model.initVelocity = model.velocity;
    
    /**
     * FightingObject sprite/view
     */
    var view = _superclass.v;
    
    // Don't allow fighting objects to go off screen
    view.body.collideWorldBounds = true;
    
    // Don't allow other sprites to push around FightingObjects
    view.body.immovable = true;
    
    view.body.velocity.x = model.velocity;
    
    // If FightingObject isn't capable of fly, spawn object at bottom of screen
    if (!model.flying) {
        view.y = GROUND_LEVEL;
    } else {
        // Otherwise, spawn object at random height within it flying range
        view.y = MathEx.randInt(model.flying.min, model.flying.max);
    }
    
    view.animations.add("move", model.viewInfo.animations.move, 20, true);
    
    /**
     * FightingObject actions/controller
     */
    var controller = _superclass.c;
    
    // Apply an status (e.g. slime, curse) to the FightingObject
    // @param status - the type of status to apply
    // @param duration - TODO
    controller.applyStatus = function(status) {
        switch (status) {
            case "slime":
                // Tint FightingObject green
                view.tint = 0x00ff00;
                
                // Slow down FightingObject by 50%
                model.velocity = model.initVelocity * 0.5;
                view.body.velocity.x = model.velocity;
                
                break;
            
            default:
                // Error!
                break;
        }
    }

    // Apply damage to this object and if need be kill this object
    // amount: the amount of damage done to this object
    controller.damage = function(amount) {
        // Subtract damage away from health
        model.health = model.health - amount;
        
        // Check to see if the object is dead
        if (model.health <= 0) {
            this.destroy();
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