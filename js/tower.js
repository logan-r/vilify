// Tower class
function Tower(game, type) {
    // Inherits from PhysicalObject
    var _superclass = PhysicalObject(game, type);
    
    /**
     * Tower data/model
     */
    var model = _superclass.m;

    /**
     * Tower sprite/view
     */
    var view = _superclass.v;


    /**
     * Tower actions/controller
     */
    var controller = _superclass.c;

    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Tower"
    };
}
