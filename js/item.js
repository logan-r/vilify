// Item class
function Item(game, type) {
    // Inherits from GameObject
    var _superclass = GameObject(game, type);
    
    /**
     * Item data/model
     */
    var model = _superclass.m;

    /**
     * Item sprite/view
     */
    var view = _superclass.v;


    /**
     * Item actions/controller
     */
    var controller = _superclass.c;

    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Item"
    };
}
