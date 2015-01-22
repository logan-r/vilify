// Monster spawner class
function Spawner(game, type, pos) {
    // Inherits from InteractiveObject
    var _superclass = InteractiveObject(game, type, pos);
    
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