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
    
    /**
     * Hero actions/controller
     */
    var controller = _superclass.c;
    
    // Destroy this hero and remove it from the game world
    controller.destroy = function() {
        heroes.remove(heroes.getParentOfView(view));
    };
    
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