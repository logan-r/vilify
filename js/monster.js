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
                        if (game.physics.arcade.overlap(view, heroes.get(i).v)) {
                            view.animations.play(ability.animation);
                            model.state = "melee attack";
                            model.action = ability.animation;
                        }
                    }
                }
            }
        }
    };
    
    /**
     * Monster data/model
     */
    var model = _superclass.m;
    
    // What the monster is currently doing (e.g. idle, attack)
    model.state = "idle";
    
    // The current ability the monster is performing
    model.action = null;
    
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