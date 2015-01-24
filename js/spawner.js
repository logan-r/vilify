// Monster spawner class
function Spawner(game, posX) {
    // Inherits from InteractiveObject
    var _superclass = InteractiveObject(game, "spawner", {x: posX, y: game.height});
    
    /**
     * Spawner actions/controller
     */
    var controller = _superclass.c;
    
    /**
     * Spawner data/model
     */
    var model = _superclass.m;
    
    /**
     * Spawner sprite/view
     */
    var view = _superclass.v;
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Spawner"
    };
}