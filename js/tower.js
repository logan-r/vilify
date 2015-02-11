// Tower class
function Tower(game, rank, posX) {
    // Find the tower's type from its rank
    var type = window.data.upgrade_data.towers[rank];
    
    // Inherits from PhysicalObject
    var _superclass = PhysicalObject(game, type, {x: posX, y: 0});
    
    /**
     * Tower global vars
     * TODO: move somewhere else
     */
    var PADDING_TOP = -8 + 75/2;//-8; // How far from the top of the page the tower is located
    var TURRET_SPACING = 20; // How close the turret is to the base - higher = closer
    
    // TODO: intergrate with model
    var count = 0;
    
    /**
     * Tower actions/controller
     */
    var controller = _superclass.c;
    
    // Update the tower - performed on every tick of the game's clock
    controller.update = function() {
        // Move tower's turret if it has a destination
        if (model.destination !== null) {
            var deltaAngle = 0; // Amount to change the turret's angle by
            
            // Is tower at destination?
            if (this.getRotation() > model.destination - model.velocity &&
                this.getRotation() < model.destination + model.velocity) {
                // Make sure tower is exactly at detination
                this.setRotation(model.destination);
                
                // Don't move tower
                deltaAngle = 0;
                
                // Has reached destination so can set that property back to null
                model.destination = null;
            } else if (model.destination < this.getRotation()) { // Is target angle smaller or larger than current angle?
                // Need to subtract velocity from angle to reach destination
                deltaAngle = model.velocity * -1;
            } else if (model.destination > this.getRotation()) {
                // Need to add velocity to angle to reach destination
                deltaAngle = model.velocity;
            }
            
            // Rotate tower
            this.setRotation(this.getRotation() + deltaAngle);
        }
        
        // If tower is in "idle" state, check if there is an action it can perform
        if (model.state === "idle") {
            if (model.hasOwnProperty("abilities")) {
                // Interate through each of the tower's abilities and check their cooldowns
                // to see if any of them are ready for use
                for (var i = 0; i < model.abilities.length; i++) {
                    var ability = model.abilities[i];
                    
                    // Check if ability is ready for use
                    if (ability.cooldown <= 0) {
                        // Use ability
                        if (ability.type == "projectile") {
                            // Play attack animation
                            view.animations.play("attack");
                            
                            // Update tower's state
                            model.state = "attack";
                            model.action = ability;
                            
                            // Reset cooldown
                            ability.cooldown = ability.cooldownLength;
                        }
                        
                        // Reset cooldown
                        ability.cooldown = ability.cooldownLength;
                    } else {
                        // Update cooldown
                        // TODO: use realtime instead of click
                        ability.cooldown--;
                    }
                }
            }
        } else if (model.state === "attack") {
            // Check if tower is done firing a projectile
            if (view.animations.getAnimation("attack").isFinished) {
                // Launch projectile
                this.fire(model.action.projectile);
                
                // Go back to idle state
                model.state = "idle";
                model.action = null;
            }
        } else if (model.state === "destructing") {
            // Check if tower is done playing destruction animation
            if (view.base.animations.getAnimation("destroy").isFinished) {
                // Downgrade the tower back to a tower placeholder
                this.downgrade();
            }
        }
        
        if (model.rank != null && model.state != "destructing") {
            // Countdown on tower's lifespan
            model.time -= game.time.elapsed;
            
            // Has tower's time expired?
            if (model.time <= 0) {
                // Tell the tower to self-destruct
                model.state = "destructing";
                model.action = null;
                
                // Play destruction animation
                view.base.animations.play("destroy");
                
                // Reset timer
                model.time = model.maxTime;
            }
        }
    };
    
    // Retrive the angle at which the turret is rotated
    // 0 is staight down, pi/2 is all the way to the left and -pi/2 is all the
    // to the right
    controller.getRotation = function() {
        return view.rotation;
    };
    
    // Rotate the tower's turret to point at a new angle
    // 0 is staight down, pi/2 is all the way to the left and -pi/2 is all the
    // to the right
    // 
    // @params
    // angle - the new angle in the turret is pointed at (in radians)
    controller.setRotation = function(angle) {
        // Rotate the turret
        view.rotation = angle;
        
        // Move the turret around the base of the tower
        view.x = model.x - (Math.abs(view.base.width) - TURRET_SPACING) / 2 * Math.sin(angle);
        view.y = (Math.abs(view.base.height) - TURRET_SPACING) * Math.cos(angle);
    };
    
    // Rotate the tower's turret so that it points towards a position
    // pos - the position the tower should be angled towards
    controller.setRotationFromPosition = function(pos) {
        // Calculate the distance angle from the center-bottom of the tower to the
        // position of the input event's triggerer
        var deltaY = pos.y;
        var deltaX = pos.x - model.x;
        var angle = Math.atan(deltaY / deltaX);
        
        // Rotate the view to match the calculated angle
        if (angle < 0) {
            model.destination = angle + Math.PI / 2;
        } else if (angle > 0) {
            model.destination = angle - Math.PI / 2;
        }
    };
    
    // Causes the tower to fire a projectile
    // type - the type of projectile to fire
    controller.fire = function(type) {
        var angle = this.getRotation();
        projectiles.add(Projectile(game, type, heroes, {
            x: view.x - Math.abs(view.height) / 2 * Math.sin(angle), 
            y: view.y + Math.abs(view.height) / 2 * Math.cos(angle)
        }, angle));
    };
    
    controller.handleInputDown = function(view, pointer) {
        model.beingDragged = true;
    };
    
    controller.handleInputUp = function(view, pointer) {
        model.beingDragged = false;
    };
    
    controller.handleBaseInputDown = function(view, pointer) {
        if (!model.beingDragged) {
            ui.setActiveObject(_self);
        }
    };
    
    // Highlight the spawner to show that it is selected
    controller.highlight = function() {
        view.highlight = game.add.graphics(0, 0);
        view.highlight.beginFill(0x6f5092, 1);
        view.highlight.drawCircle(model.x, 0, Math.abs(view.base.height) + 70);
        highlights.add(view.highlight);
    };
    
    // Remove the spawner's highlight to show that it is no longer selected
    controller.unhighlight = function() {
        if (view.highlight) {
            view.highlight.destroy();
        }
    };
    
    // Upgrades the tower
    // Returns true if the tower was upgraded, else returns false
    // rank - the rank (e.g. "T", "C", "A") of the item the tower was upgraded with
    controller.upgrade = function(rank) {
        /* Step 1. Determine the new rank */
        
        // If the tower currently is destroyed and doesn't have a rank (indecated
        // by the towers rank being null), build a new rank 1 tower
        if (model.rank === null) {
            model.rank = rank;
        } else {
            // Otherwise upgrade the tower by appending the rank onto the current
            // rank (for example, a "TT" tower upgraded with a "T" item becomes
            // a "TTT" tower)
            
            // But first check to make sure it is a valid upgrade
            if (model.rank.length == 3) {
                // Tower has reach upgrade limit, don't upgrade
                return false;
            } else {
                // Check to make sure item type matches type previous upgrades
                // e.g. can't add a "C" to a "TT" tower
                // TODO: maybe change this later?
                for (var i = 0; i < model.rank.length; i++) {
                    if (rank != model.rank[i]) {
                        return false;
                    }
                }
            }
            
            // No errors thrown, go ahead and upgrade
            model.rank = model.rank + rank;
        }
        
        /* Step 2. Reload data based on new rank */
        this.reloadProperties();
        
        return true;
    };
    
    // Downgrades the tower to a broken tower
    controller.downgrade = function() {
        // Set the towers rank to null
        model.rank = null;
        
        // Reload the tower's properties
        this.reloadProperties();
    };
    
    // Reload the towers properties based upon it rank
    // Must be called after changing the tower's rank
    controller.reloadProperties = function() {
        // Update the tower's type based upon its rank
        model.type = window.data.upgrade_data.towers[model.rank];
        
        // Load tower stats window.data.model_data
        if (window.data.model_data.hasOwnProperty(model.type)) {
            for (var property in window.data.model_data[model.type]) {
                if (window.data.model_data[model.type].hasOwnProperty(property)) {
                    model[property] = window.data.model_data[model.type][property];
                }
            }
        }
        
        // Load view data from window.data.view_data
        if (window.data.view_data.hasOwnProperty(model.type)) {
            model.viewInfo = {};
            for (var property in window.data.view_data[model.type]) {
                if (window.data.view_data[model.type].hasOwnProperty(property)) {
                    model.viewInfo[property] = window.data.view_data[model.type][property];
                }
            }
        }
        
        /* Step 3. Update tower with new properties */
        
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
        
        // Scale the sprite based upon the data defined in view_data
        view.base.scale.x = window.data.view_data["tower base"].scale.x;
        view.base.scale.y = window.data.view_data["tower base"].scale.y;
        
        // Set base's image depending on the tower's type
        view.base.frameName = model.viewInfo.base_frame;
    
        // Set base's image's tint
        if (model.viewInfo.hasOwnProperty("tint")) {
            view.base.tint = model.viewInfo.tint;
        }
    };
    
    /**
     * Tower data/model
     */
    var model = _superclass.m;
    
    // The rank of the tower (i.e. "TT", "A", "CCC", etc.)
    model.rank = rank;
    
    // The tower's state (i.e. idle or firing)
    model.state = "idle";
    
    // How much time the tower has left before it wears out (30000 mSec i.e. 30 sec)
    model.time = model.maxTime = 30000;
    
    // The current ability/attack/action the tower is performing (null if idle)
    model.action = null;
    
    // The x position of the tower
    model.x = posX;
    
    // Angle that the tower wants to move its turret to
    model.destination = null;
    
    // Is the turret currently being dragged?
    model.beingDragged = false;
    
    // Speed at which the turret moves
    model.velocity = window.data.constants.TOWER_ANGULAR_VELOCITY;
    
    /**
     * Tower sprite/view
     * Unlike most objects, towers have two sprites instead of one in its
     * view: one for its base and one for its turret
     */
    var view = _superclass.v;
    view.anchor.setTo(0.5, 1);
    
    view.base = game.add.sprite(posX, PADDING_TOP, "tower base");
    
    // Set the sprite's anchor point to the center of the sprite
    view.base.anchor.setTo(0.5, 0.5);
    
    // Enable physics on base
    game.physics.arcade.enable(view.base);
    
    // Scale the sprite based upon the data defined in view_data
    view.base.scale.x = window.data.view_data["tower base"].scale.x;
    view.base.scale.y = window.data.view_data["tower base"].scale.y;
    
    // Set base's image depending on the tower's type
    view.base.frameName = model.viewInfo.base_frame;
    
    // Init towwer highlight (null for none currently)
    view.highlight = null;
    
    // Set base's image's tint
    if (model.viewInfo.hasOwnProperty("tint")) {
        view.base.tint = model.viewInfo.tint;
    }
    
    // Allow turret to be dragged
    view.inputEnabled = true;
    
    // Setup turret dragging event handling
    view.events.onInputDown.add(controller.handleInputDown, controller);
    view.events.onInputUp.add(controller.handleInputUp, controller);
    
    // Set up base selected handling
    view.base.inputEnabled = true;
    view.base.events.onInputDown.add(controller.handleBaseInputDown, controller);
    
    // Add attack animation
    view.animations.add("idle", ["1.png"], FPS, false);
    view.animations.add("attack", ["1.png","2.png","3.png","4.png","5.png","6.png","7.png","8.png","9.png","10.png","11.png","12.png","13.png","14.png","15.png"], FPS, false);
    
    // Add destruction animation
    view.base.animations.add("destroy", ["1.png", "2.png", "3.png", "4.png", "5.png", "6.png", "7.png", "8.png", "9.png"], FPS, false)
    
    view.animations.play("idle");    
    
    // Position and angle the turret
    controller.setRotation(-Math.PI / 2 + 1);
    
    /**
     * Generate object that is an instance of this class
     */
    var _self = {
        m: model,
        v: view,
        c: controller,
        type: "Tower"
    }; return _self;
}
