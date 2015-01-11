// Tower class
function Tower(game, type, posX) {
    // Inherits from PhysicalObject
    var _superclass = PhysicalObject(game, "turret", {x: posX, y: 0}, towers.views);
    
    /**
     * Tower global vars
     * TODO: move somewhere else
     */
    var PADDING_TOP = -8; // How far from the top of the page the tower is located
    var TURRET_SPACING = 15; // How close the turret is to the base - higher = closer
    
    
    // TODO: intergrate with model
    var count = 0;
    
    /**
     * Tower actions/controller
     */
    var controller = _superclass.c;
    
    // Update the tower - performed on every tick of the game's clock
    controller.update = function() {
        // Move tower's turret if it has a destination
        if (model.destination !== null) {
            var deltaAngle = 0; // Amount to change the turret's angle by
            
            
            // Is tower at destination?
            if (this.getRotation() > model.destination - model.velocity &&
                this.getRotation() < model.destination + model.velocity) {
                // Make sure tower is exactly at detination
                this.setRotation(model.destination);
                
                // Don't move tower
                deltaAngle = 0;
                
                // Has reached destination so can set that property back to null
                this.destination = null;
            } else if (model.destination < this.getRotation()) { // Is target angle smaller or larger than current angle?
                // Need to subtract velocity from angle to reach destination
                deltaAngle = model.velocity * -1;
            } else if (model.destination > this.getRotation()) {
                // Need to add velocity to angle to reach destination
                deltaAngle = model.velocity;
            }
            
            // Rotate tower
            this.setRotation(this.getRotation() + deltaAngle);
        }
        
        // Fire a projectile every 55 ticks - TODO: intergrate rate of fire
        count++;
        if (count > 100) {
            count = 0;
            this.fire();
        }
    };
    
    // Retrive the angle at which the turret is rotated
    // 0 is staight down, pi/2 is all the way to the left and -pi/2 is all the
    // to the right
    controller.getRotation = function() {
        return view.turret.rotation;
    };
    
    // Rotate the towers turret to point at a new angle
    // 0 is staight down, pi/2 is all the way to the left and -pi/2 is all the
    // to the right
    // 
    // @params
    // angle - the new angle in the turret is pointed at (in radians)
    controller.setRotation = function(angle) {
        // Rotate the turret
        view.turret.rotation = angle;
        
        // Move the turret around the base of the tower
        view.turret.x = model.x - (Math.abs(view.base.width) / 2) * Math.sin(view.turret.rotation) +  TURRET_SPACING * Math.sin(view.turret.rotation);
        view.turret.y = (Math.abs(view.base.height) + PADDING_TOP) * Math.cos(view.turret.rotation) -  TURRET_SPACING * Math.cos(view.turret.rotation);
    };
    
    // Causes the tower to fire a projectile
    controller.fire = function() {
        var angle = this.getRotation();
        projectiles.items.push(Projectile(game, "missile", {
            x: view.turret.x - Math.abs(view.turret.height) / 2 * Math.sin(angle), 
            y: view.turret.y + Math.abs(view.turret.height) / 2 * Math.cos(angle)
        }, angle + Math.PI));
    };
    
    /**
     * Tower data/model
     */
    var model = _superclass.m;
    
    // The x position of the tower
    model.x = posX;
    
    // Angle that the tower wants to move its turret to
    model.destination = -Math.PI / 2 + 1;

    /**
     * Tower sprite/view
     * Unlike most objects, towers have two sprites instead of one in its
     * view: one for its base and one for its turret
     */
    var view = {};
    view.turret = _superclass.v;
    view.turret.anchor.setTo(0.5, 1);
    
    view.base = towers.views.create(posX, PADDING_TOP, "base");
    
    // Set the sprite's anchor point to the center of the sprite
    view.base.anchor.setTo(0.5, 1);
    
    // Scale the sprite based upon the data defined in view_data
    view.base.scale.x = window.data.view_data["base"].scale.x;
    view.base.scale.y = window.data.view_data["base"].scale.y;
    
    // Position and angle the turret
    controller.setRotation(Math.PI / 2 - 1);

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
