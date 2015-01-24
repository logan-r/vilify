// Monster class
function Monster(game, rank, posX) {
    // Find the monster's type from its rank
    var type = window.data.upgrade_data.monsters[rank];
    
    // Inherits from FightingObject
    var _superclass = FightingObject(game, type, {x: posX, y: 0});
    
    /**
     * Monster actions/controller
     */
    var controller = _superclass.c;
    
    // Update the monster - performed on every tick of the game's clock
    controller.update = function() {
        if (model.hasOwnProperty("abilities")) {
            
            // Update current state
            if (model.state === "idle") {
                // Make sure monster is performing "idle" animation
                if (!view.animations.getAnimation("idle").isPlaying) {
                    view.animations.play("idle");
                }
            } else if (model.state === "melee attack") {
                // Check if attack animation is completed
                if (view.animations.getAnimation(model.action).isFinished) {
                    // Deal damage to hero
                    model.target.c.damage(1 * view.animations.getAnimation(model.action).frameTotal);
                    
                    // Go back to idle state
                    model.state = "idle";
                    model.action = null;
                }
            }
            
            var closestHero = this.getClosestHero();
            if (closestHero !== null) {
                console.log(closestHero.hero.m.type + " - " + closestHero.distance);
            } else {
                console.log(null);
            }
            
            // If the monster is in an idle state, see if it can use any of its
            // abilities
            if (model.state === "idle") {
                for (var i = 0; i < model.abilities.length; i++) {
                    var ability = model.abilities[i];
                    
                    if (ability.type === "melee attack") {
                        // Check if any heroes are within meele range
                        for (var i = 0; i < heroes.objs.length; i++) {
                            var hero = heroes.objs[i];
                            
                            if (controller.inMeeleRange(hero.v)) {
                                view.animations.play(ability.animation);
                                model.state = "melee attack";
                                model.action = ability.animation;
                                model.target = hero;
                                break;
                            }
                        }
                    }
                }
            }
        }
    };
    
    // Upgrades the monster
    // Returns true if the monster was upgraded, else returns false
    // rank - the rank (e.g. "T", "C", "A") of the item the monster was upgraded with
    controller.upgrade = function(rank) {
        /* Step 1. Determine the new rank */
            
        // First check to make sure this is a valid upgrade, can't upgrade beyond rank 3
        if (model.rank.length == 3) {
            // Tower has reach upgrade limit, don't upgrade
            return false;
        } else {
            // Check to make sure item type matches type previous upgrades
            // e.g. can't add a "C" to a "TT" monster
            // TODO: maybe change this later?
            for (var i = 0; i < model.rank.length; i++) {
                if (rank != model.rank[i]) {
                    return false;
                }
            }
        }
            
        // No errors thrown, go ahead and upgrade
        model.rank = model.rank + rank;
        
        /* Step 2. Reload data based on new rank */
        
        // Update the tower's type based upon its rank
        model.type = window.data.upgrade_data.monsters[model.rank];
        
        // Load monster stats from window.data.model_data
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
        
        /* Step 3. Update monster with new properties */
        
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
        
        // Switch to default animation to avoid confilicts
        view.animations.play("idle");
        
        // Switch the texture of the sprite
        view.loadTexture(model.viewInfo.image);
        view.body.setSize(view.width, view.height);
        
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
        
        
        // Save initial height and width for latter
        model.width = view.width;
        model.height = view.height;
        
        view.animations.play("idle");
        
        // Reset state variables
        model.state = "idle";
        model.action = null;
        model.target = null;
        
        return true;
    };
    
    // Returns the closest hero to the monster and its distance (either "meele"
    // or a number if not in meele range) - returns null if no heroes (or if all
    // heroes have moved past the monster)
    controller.getClosestHero = function() {
        var closestHero = null;
        
        // Interate through all heroes, checking their distance
        for (var i = 0; i < heroes.objs.length; i++) {
            var hero = heroes.objs[i];
            
            if (controller.inMeeleRange(hero.v)) {
                // Found a hero within meele range - this is the closest a hero
                // can get so we don't need to continue looking through the heroes
                return {
                    "hero": hero,
                    "distance": "meele"
                };
            } else {
                // Find how far away the hero is
                var distance = this.distanceTo(hero.v);
                
                // Make sure the hero is to the left of the monster
                if (distance !== null) {
                    // If there is not yet a closestHero, this automatically qualifies
                    if (closestHero === null) {
                        closestHero = {
                            "hero": hero,
                            "distance": distance
                        };
                    } else {
                        // Check if this hero is closer than the previous closestHero
                        if (distance < closestHero.distance) {
                            closestHero = {
                                "hero": hero,
                                "distance": distance
                            };
                        }
                    }
                }
            }
        }
        
        return closestHero;
    };
    
    // Check if a hero is close enough to a monster for the monster to be
    // able to hit it with a meele attack
    controller.inMeeleRange = function(heroView) {
        // Calculate position data
        var heroRight = heroView.x + Math.abs(heroView.width) / 2;
        var monsterLeft = view.x - Math.abs(model.width) / 2;
        var monsterTop = view.y - Math.abs(model.height);
        
        // See if hero is in range
        return (heroRight >= monsterLeft + model.reach[0] &&
                heroRight <= monsterLeft + model.reach[1]);
    };
    
    // Gets how far away a hero is from the monster (note: as soon as a hero pases
    // out of the monster's meele range, the monster can no longer reach it, so this
    // function returns null if the hero is to the right of the monster)
    // @param hero - the hero to check how far away from the monster it is
    controller.distanceTo = function(heroView) {
        // Calculate position data
        var heroRight = heroView.x + Math.abs(heroView.width) / 2;
        var monsterLeft = view.x - Math.abs(model.width) / 2;
        var monsterTop = view.y - Math.abs(model.height);
        
        // Check if the hero is in meele range
        if (this.inMeeleRange(heroView)) {
            return "meele";
        }
        
        // Check to make sure hero isn't to the right of the monster
        if (heroRight > monsterLeft + model.reach[1]) {
            return null;
        }
        
        // Otherwise return the distance from the monster to the hero
        return monsterLeft + model.reach[0] - heroRight;
    };
    
    /**
     * Monster data/model
     */
    var model = _superclass.m;
    
    // The rank of the model (i.e. "TT", "A", "CCC", etc.)
    model.rank = rank;
    
    // What the monster is currently doing (e.g. idle, attack)
    model.state = "idle";
    
    // The current ability the monster is performing
    model.action = null;
    
    // The hero the monster is currently attacking
    model.target = null;
    
    /**
     * Monster sprite/view
     */
    var view = _superclass.v;
    
    // Monsters don't move
    view.body.velocity.x = 0;
    
    // Save initial height and width for latter
    model.width = view.width;
    model.height = view.height;
    
    /**
     * Init sprite
     */
    view.animations.play("idle");
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Monster"
    };
}