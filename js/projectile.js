// Projectile class
function Projectile(game, type, pos, angle) {
    // Inherits from AnimateObject
    var _superclass = AnimateObject(game, type, pos, projectiles.views);
    
    
    /**
     * Projectile actions/controller
     */
    var controller = _superclass.c;
    
    // Update the projectile - performed on every tick of the game's clock
    controller.update = function() {
        // Calculate horizontal and vertical portions of velocity
        view.body.velocity.x = controller.getHorizontalVelocity();
        view.body.velocity.y = controller.getVerticalVelocity();
        
        // Keep the projectile's angle within it initial quadrant
        if (view.body.angularVelocity < 0 && view.angle > 0) {
            view.body.angularVelocity = 0;
            view.body.angularAcceleration = 0;
            view.rotation = Math.PI;
        } else if (view.body.angularVelocity > 0 && view.angle < 0) {
            view.body.angularVelocity = 0;
            view.body.angularAcceleration = 0;
            view.rotation = Math.PI;
        }
    };
    
    // Calculate the horizontal portion of the projectiles total velocity based
    // upon the angle that the projecitle is point in
    controller.getHorizontalVelocity = function() {
        // Calculate vertical component of total velocity
        return Math.sin(view.rotation) * model.velocity;
    };
    
    // Calculate the verticle portion of the projectiles total velocity based
    // upon the angle that the projecitle is point in
    controller.getVerticalVelocity = function() {
        // Calculate vertical component of total velocity
        return -Math.cos(view.rotation) * model.velocity;
    };
    
    
    /**
     * Projectile data/model
     */
    var model = _superclass.m;
    
    // Total velocity of projectile
    model.velocity = 500;
    
    // Intial angle of the projectile
    model.initialAngle = angle;
    
    /**
     * Projectile sprite/view
     */
    var view = _superclass.v;
    
    // Projecitle should be pointing in the param "Angle" that was passed to this contructor
    // Note: angle is in radians
    view.rotation = angle;
    
    // The rate at which the angle changes
    view.body.angularAcceleration = 50 * Math.cos(angle - Math.PI / 2);
    
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
