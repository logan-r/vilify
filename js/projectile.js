// Projectile class
function Projectile(game, type) {
    // Inherits from AnimateObject
    var _superclass = AnimateObject(game, type);
    
    /**
     * Projectile data/model
     */
    var model = _superclass.m;

    /**
     * Projectile sprite/view
     */
    var view = _superclass.v;


    /**
     * Projectile actions/controller
     */
    var controller = _superclass.c;

    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Projectile"
    };
}
