// Monster class
function Monster(game, type, posX) {
    // Inherits from FightingObject
    var _superclass = FightingObject(game, type, {x: posX, y: 0});
    
    /**
     * Monster actions/controller
     */
    var controller = _superclass.c;
    
    // Update the monster - performed on every tick of the game's clock
    controller.update = function() {
        if (model.hasOwnProperty("abilities")) {
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
            
            // Interate through each of the monster's abilities and see if any of
            // them can be used
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
    };
    
    // Check if a hero is close enough to a monster for the monster to be
    // able to hit it with a meele attack
    controller.inMeeleRange = function(heroView) {
        // Calculate position data
        var heroRight = heroView.x + Math.abs(heroView.width) / 2;
        var monsterLeft = view.x - Math.abs(view.width) / 2;
        var monsterTop = view.y - Math.abs(view.height);
        
        // See if hero is in range
        return (heroRight >= monsterLeft + model.reach[0] &&
                heroRight <= monsterLeft + model.reach[1] &&
                heroView.y > monsterTop);
    };
    
    /**
     * Monster data/model
     */
    var model = _superclass.m;
    
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