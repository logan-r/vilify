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