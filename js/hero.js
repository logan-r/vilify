// Hero class
function Hero(game, type) {
    // Inherits from FightingObject
    var _superclass = FightingObject(game, type, {x: 0, y: 0});
    
    /**
     * Hero data/model
     */
    var model = _superclass.m;
    
    /**
     * Hero sprite/view
     */
    var view = _superclass.v;
    
    // Spawn hero at left of screen
    view.x = 0 - Math.abs(view.width) / 2;
    
    // If hero isn't capable of fly, spawn hero at bottom of screen
    if (!model.flying) {
        view.y = game.height - FLOOR_HEIGHT / 2 + 4;
    } else {
        // Spawn hero at random height within it flying range
        view.y = MathEx.randInt(model.flying.min, model.flying.max);
    }
    
    /**
     * Hero actions/controller
     */
    var controller = _superclass.c;
    
    /**
     * Init sprite
     */
    view.animations.play("move");
    
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