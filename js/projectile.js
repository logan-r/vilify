// Projectile class
function Projectile(game, type, angle) {
    // Inherits from AnimateObject
    var _superclass = AnimateObject(game, type);
    
    
    /**
     * Projectile actions/controller
     */
    var controller = _superclass.c;
    
    controller.getHorizontalVelocity = function() {
        // Calculate vertical component of total velocity
        return Math.sin(view.rotation) * model.velocity;
    };
    
    controller.getVerticalVelocity = function() {
        // Calculate vertical component of total velocity
        return -Math.cos(view.rotation) * model.velocity;
    };
    
    
    /**
     * Projectile data/model
     */
    var model = _superclass.m;
    
    // Total velocity of projectile
    model.velocity = 100;
    
    /**
     * Projectile sprite/view
     */
    var view = _superclass.v;
    
    // Spawn projectile in center top corner of screen
    view.x = game.width / 2;
    view.y = game.height / 2;//0 - Math.abs(view.height) / 2;
    
    // Projecitle should be pointing in the param "Angle" that was passed to this contructor
    // Note: angle is in radians
    view.rotation = angle;
    
    // The rate at which the angle changes
    view.body.angularVelocity = 0;
    
    // Calculate vertical and horizontal portions of velocity based upon angle
    // and total velocity
    view.body.velocity.x = controller.getHorizontalVelocity();
    view.body.velocity.y = controller.getVerticalVelocity();
    

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
