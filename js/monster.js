// Monster class
function Monster(game, type) {
    // Inherits from FightingObject
    var _superclass = FightingObject(game, type, {x: 0, y: 0});
    
    /**
     * Monster data/model
     */
    var model = _superclass.m;
    
    
    /**
     * Monster sprite/view
     */
    var view = _superclass.v;
    
    // Spawn monster in bottom right corner of screen
    view.x = game.width + Math.abs(view.width) / 2;
    view.y = game.height - Math.abs(view.height) / 2;
    
    view.body.velocity.x = -300;
    
    view.animations.add("move", null, 20, true);
    
    view.animations.play("move");
    
    
    /**
     * Monster actions/controller
     */
    var controller = _superclass.c;
    
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