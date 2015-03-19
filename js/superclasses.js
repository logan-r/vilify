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
        if (model.viewInfo.scale.hasOwnProperty("x")) {
            pos.x = pos.x + model.viewInfo.offset.x;
        }
        
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
    
    // Set the sprite's size
    if (model.viewInfo.hasOwnProperty("size")) {
        if (model.viewInfo.scale.hasOwnProperty("width")) {
            view.width = model.viewInfo.width;
        }
        
        if (model.viewInfo.scale.hasOwnProperty("height")) {
            view.height = model.viewInfo.height;
        }
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
    
    // Add all animations defined in view_data
    if (model.viewInfo.hasOwnProperty("animations")) {
        // Interat through each animation an add each indivdually
        for (var anim in model.viewInfo.animations) {
            if (model.viewInfo.animations.hasOwnProperty(anim)) {
                // Is the animation looping? (default to true if not defined in view data file)
                var loop = true;
                if (model.viewInfo.animations[anim].hasOwnProperty("loop")) {
                    loop = model.viewInfo.animations[anim].loop;
                }
                view.animations.add(anim, model.viewInfo.animations[anim].frames, FPS, loop);
            }
        }
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
    
    // What the FighingObject is currently doing (e.g. "idle", "attack")
    model.state = "idle";
    
    // The current ability this FighingObject is performing (either null or an object)
    model.action = null;
    
    // The FightingObject this object is currently attacking
    model.target = null;
    
    // What group of FightingObjects should projectiles fired by this object
    // target? (defaults to heroes)
    model.targets = heroes;
    
    /**
     * FightingObject sprite/view
     */
    var view = _superclass.v;
    
    // Don't allow fighting objects to go off screen
    view.body.collideWorldBounds = true;
    
    // Don't allow other sprites to push around FightingObjects
    view.body.immovable = true;
    
    // Save initial height and width for latter
    model.width = view.width;
    model.height = view.height;
    
    // If FightingObject isn't capable of fly, spawn object at bottom of screen
    if (!model.flying) {
        view.y = GROUND_LEVEL;
    } else {
        // Otherwise, spawn object at random height within it flying range
        view.y = MathEx.randInt(model.flying.min, model.flying.max);
    }
    
    /**
     * FightingObject actions/controller
     */
    var controller = _superclass.c;
    
    // Calculate what action the FightingObject should take next
    controller.calculateNewAction = function() {
        // Overriden by subclasses
    };
    
    // Update the FighingObject depending on its current state
    controller.updateState = function() {
        // Call the update function that corresponds to the FightingObject's state
        controller["update_" + model.state]();
    };
    
    controller.update_idle = function() {
        // Make sure FightingObject is performing "idle" animation
        if (!view.animations.getAnimation("idle").isPlaying) {
            view.animations.play("idle");
        }
        
        // Check to see if there is a non-idle action the FighingObject can take
        this.calculateNewAction();
    };
    
    controller.update_melee_attack = function() {
        // Check if attack animation is completed
        if (view.animations.getAnimation(model.action.animation).isFinished) {
            // Deal damage to target
            model.target.c.damage(1 * view.animations.getAnimation(model.action.animation).frameTotal);
            
            // Go back to idle state
            model.state = "idle";
            model.action = null;
        }
    };
    
    controller.update_range_attack = function() {
        // Check if attack animation is completed
        if (view.animations.getAnimation(model.action.animation).isFinished) {
            // Launch projectile
            this.fire(model.action.projectile, model.action.angle, model.action.offsetY);
            
            // Go back to idle state
            model.state = "idle";
            model.action = null;
        }
    };
    
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
            
            case "curse":
                // Tint FightingObject purple
                view.tint = 0xff00ff;
                
                // TODO: Reduce the FightingObject's damage
                
                break;
            
            default:
                // Error!
                break;
        }
    };
    
    // Returns the FightingObject from a group of FightingObjects that
    // does not include this FightingObject that is closest to this 
    // FightingObject and its distance from this object (either "melee"
    // or a number if not in melee range) - returns null if none of the objects
    // from the group are in range
    // @param group - the group of FightingObject to find the closest of
    controller.getClosest = function(group) {
        var closest = null;
        
        // Interate through all the FightingObject in the group, checking their
        // distances
        for (var i = 0; i < group.objs.length; i++) {
            var fightingObj = group.objs[i];
            
            if (controller.inMeleeRange(fightingObj)) {
                // Found a FightingObject within meele range - this is the
                // closest another FightingObject can get to this object so we
                // don't need to continue looking through the group
                return {
                    "obj": fightingObj,
                    "distance": "melee"
                };
            } else {
                // Find how far away the FightingObject is
                var distance = this.distanceTo(fightingObj);
                
                // Make sure the FightingObject is to the left of this object
                if (distance !== null) {
                    // If there is not yet a closest, this automatically
                    // qualifies (at least until a closer object is found)
                    if (closest === null) {
                        closest = {
                            "obj": fightingObj,
                            "distance": distance
                        };
                    } else {
                        // Check if this object is closer than the previous
                        // closest object
                        if (distance < closest.distance) {
                            closest = {
                                "obj": fightingObj,
                                "distance": distance
                            };
                        }
                    }
                }
            }
        }
        
        return closest;
    };
    
    // Checks if a hero is close enough for this FightingObject
    // to be able to hit it with a meele attack
    // @param hero - the hero that this function checks whether or not is in range
    controller.inMeleeRange = function(enemy) {
        // Calculate position data
        var enemyRight = enemy.v.x + Math.abs(enemy.v.width) / 2 - enemy.m.reach;
        var myLeft = view.x - Math.abs(model.width) / 2;
        var myTop = view.y - Math.abs(model.height);
        
        // See if hero is in range
        return (enemyRight >= myLeft + model.reach[0] &&
                enemyRight <= myLeft + model.reach[1]);
        // TODO: Check if enemy is flying
    };
    
    // Gets how far away another FightingObject is from this FightingObject
    // (note: as soon as the enemy FightingObject pases out of this 
    // FightingObject's meele range, the other FightingObject can no longer 
    // reach it, so this function returns null if the enemy Fighting is to the 
    // right of this FightingObject)
    // TODO: possibly edit calculation to account for the case of one of the
    // FightingObjects being flying?
    // @param enemy - the enemy FightingObject whose distance from this 
    // FightingObject is trying to be found
    controller.distanceTo = function(enemy) {
        // Calculate position data
        var enemyRight = enemy.v.x + Math.abs(enemy.v.width) / 2 - enemy.m.reach;
        var myLeft = view.x - Math.abs(model.width) / 2;
        var myTop = view.y - Math.abs(model.height);
        
        // Check if the enemy is in meele range
        if (this.inMeleeRange(enemy)) {
            return "melee";
        }
        
        // Check to make sure enemy isn't to the right of this object
        if (enemyRight > myLeft + model.reach[1]) {
            return null;
        }
        
        // Otherwise return the distance from this object to the enemy
        return myLeft + model.reach[0] - enemyRight;
    };

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
    
    // Causes the FightingObject to fire a projectile
    // @param type - the type of projectile to fire
    // @param angle - the angle at which to launch the projectile
    controller.fire = function(type, angle, offsetY) {
        projectiles.add(Projectile(game, type, window.heroes, {
            x: view.x, 
            y: view.y - Math.abs(view.height) + offsetY
        }, angle));
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