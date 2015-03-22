// Hero class
function Hero(game, type) {
    // Inherits from FightingObject
    var _superclass = FightingObject(game, type, {x: 0, y: 0});
    
    /**
     * Hero actions/controller
     */
    var controller = _superclass.c;
    
    // Update the hero - called each tick
    controller.update = function() {
        // Check to see if there is a non-idle action the Hero can take
        if (model.state === "idle") {
            this.calculateNewAction();
        }
        
        // Only move the hero if it is still in moving state
        if (model.state === "idle") {
            view.body.velocity.x = model.velocity;
            
            // Make sure hero is at the correct y position
            view.y = model.y;
        } else if (model.state === "knockback") {
            // TODO
        } else {
            view.body.velocity.x = 0;
        }
        
        if (model.hasOwnProperty("abilities")) {
            // Update hero based upon what action it is currently performing
            this.updateState();
        }
    };
    
    // Calculate what action the hero should take next
    controller.calculateNewAction = function() {
        // Find the closest monster
        var closestMonster = this.getClosest(monsters);
        
        // Check to make sure there is a closestMonster
        if (closestMonster !== null) {
            // Is monster within melee range?
            if (closestMonster.distance === "melee") {
                // Find all melee abilities
                var meleeAbilities = [];
                
                // Interate through all the hero's abilities checking to see
                // if they are melee attacks
                for (var i = 0; i < model.abilities.length; i++) {
                    var ability = model.abilities[i];
                    if (ability.type === "melee_attack") {
                        meleeAbilities.push(ability);
                    }
                }
                
                // Select a random melee attack from the list of abilities
                var ability = meleeAbilities[MathEx.randInt(0, meleeAbilities.length - 1)];
                    
                // Play attack animation
                view.animations.play(ability.animation);
                
                // Update hero state
                model.state = ability.type;
                model.action = ability;
                model.target = closestMonster.obj;
            } else {
                // Does the hero have any ranged abilities?
                for (var i = 0; i < model.abilities.length; i++) {
                    var ability = model.abilities[i];
                    if (ability.type === "range_attack") {
                        // Check if ability is ready for use
                        if (ability.cooldown <= 0) {
                            // Play attack animation
                            view.animations.play(ability.animation);
                            
                            // Update hero's state
                            model.state = ability.type;
                            model.action = ability;
                            model.target = closestMonster.obj;
                            
                            // Reset cooldown
                            ability.cooldown = ability.cooldownLength;
                            
                            break;
                        } else {
                            // Update cooldown
                            ability.cooldown -= 1000 / window.data.constants.FPS;
                        }
                    }
                }
            }
        }
    };
    
    // Update function for when the hero is in the knockback state
    controller.update_knockback = function() {
        // Check if hero has landed on the ground (and thus if the knockback is over)
        if (view.y > model.y) {
            // Reset movement
            view.body.velocity.x = 0;
            view.body.velocity.y = 0;
            view.body.acceleration.y = 0;
            view.y = model.y;
            
            // Go back to idle state
            model.state = "idle";
        }
    };
    
    // Checks if a monster is close enough for this hero to be able to hit it
    // with a meele attack (this function overrides the
    // FightingObject.inMeleeRange to check for monsters to the right instead of
    // the left)
    controller.inMeleeRange = function(monster) {
        // Check if hero is in the monster's melee range
        return monster.c.inMeleeRange(_self);
    };
    
    // Gets how far away a FightingObject is from this hero
    // (note: as soon as the enemy FightingObject pases out of this hero's meele
    // range, the hero can no longer reach it, so this function returns null if
    // the enemy Fighting is to the left of this FightingObject)
    // TODO: possibly edit calculation to account for the case of one of the
    // FightingObjects being flying?
    // NOTE: this function overrides the FightingObject.distanceTo function to
    // check for the distance right instead of the left
    // @param enemyView - the view of the enemy FightingObject whose distance
    // from this hero is trying to be found
    controller.distanceTo = function(monster) {
        // Check how far away the hero is is from the monster
        return monster.c.distanceTo(_self);
    };
    
    // Destroy this hero and remove it from the game world
    controller.destroy = function() {
        // Kill the hero
        heroes.remove(heroes.getParentOfView(view));
        
        // Give the player research
        // TODO: improve - relating amount of research to hero's strength
        window.research++;
    };
    
    // Debug the hero's reach by drawing a rectangle on the screen
    controller.debugReach = function() {
        var reach = new Phaser.Rectangle(view.x + Math.abs(view.width) / 2 - model.reach, game.height - view.height, 1, view.height);
        game.debug.geom(floor, '#0fffff');
    };
    
    /**
     * Hero data/model
     */
    var model = _superclass.m;
    
    // Save the intial velocity the object is traveling at for future reference
    model.initVelocity = model.velocity;
    
    // Projectiles fired by a hero should target monsters not other heroes
    model.targets = monsters;
    
    /**
     * Hero sprite/view
     */
    var view = _superclass.v;
    
    // Spawn hero at left of screen
    view.x = 0 - Math.abs(view.width) / 2;
    
    // Set hero's movement speed
    view.body.velocity.x = model.velocity;
    
    /**
     * Init sprite
     */
    view.animations.play("idle");
    
    /**
     * Generate object that is an instance of this class
     */
    var _self = {
        m: model,
        v: view,
        c: controller,
        type: "Hero"
    }; return _self;
}