// Hero class
function Hero(game, type) {
    // Inherits from FightingObject
    var _superclass = FightingObject(game, type);
    
    /**
     * Hero data/model
     */
    var model = _superclass.m;
    
    
    /**
     * Hero sprite/view
     */
    var view = _superclass.v;
    
    // TODO: find a way to vary scalling of objects
    view.scale.x = -0.5;
    view.scale.y = 0.5;
    
    // Spawn hero in bottom left corner of screen
    view.x = 0 - Math.abs(view.width) / 2;
    view.y = game.world.height - view.height / 2 - 14 /* Account for floor */;
    
    // Enable physics on hero
    game.physics.arcade.enable(view);
    
    view.body.velocity.x = 100;
    
    view.animations.add("move", null, 20, true);
    
    view.animations.play("move");
    
    
    /**
     * Hero actions/controller
     */
    var controller = _superclass.c;
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Hero"
    };
}