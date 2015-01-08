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
    
    // Spawn monster in center top corner of screen
    view.x = game.width / 2;
    view.y = 0 - Math.abs(view.height) / 2;
    
    view.body.velocity.y = 300;
    

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
