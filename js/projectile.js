// Projectile class
function Projectile(game, type, pos, angle) {
    // Inherits from AnimateObject
    var _superclass = AnimateObject(game, type, pos);
    
    
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
    model.velocity = 300;
    
    /**
     * Projectile sprite/view
     */
    var view = _superclass.v;
    
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
