// Projectile class
function Projectile(game, type, pos, angle) {
    // Inherits from AnimateObject
    var _superclass = AnimateObject(game, type, pos);
    
    
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
        
        // Check to see if projectile has hit ground yet
        if (view.y >= GROUND_LEVEL - Math.abs(view.height)) {
            this.implode();
        }
    };
    
    // Projectile has hit some sort of target, now it should detonate or whatever
    controller.implode = function() {
        // Destroy projectile
        projectiles.remove(projectiles.getParentOfView(view));
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
     * Animation
     */
    
    // If projectile has a "move" animation sequence then play it
    if (model.viewInfo.hasOwnProperty("animations") && model.viewInfo.animations.hasOwnProperty("move")) {
        view.animations.add("move", model.viewInfo.animations.move, 20, true);
        view.animations.play("move");
    }
    
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
