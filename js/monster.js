// Monster class
function Monster(game, type) {
    // Inherits from FightingObject
    var _superclass = FightingObject(game, type);
    
    /**
     * Monster data/model
     */
    var model = _superclass.m;
    
    
    /**
     * Monster sprite/view
     */
    var view = _superclass.v;
    
    
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