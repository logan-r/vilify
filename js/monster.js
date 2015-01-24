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
        // TODO
    };
    
    /**
     * Monster data/model
     */
    var model = _superclass.m;
    
    /**
     * Monster sprite/view
     */
    var view = _superclass.v;
    
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
        type: "Monster"
    };
}