// Tower class
function Tower(game, type, posX) {
    // Inherits from PhysicalObject
    var _superclass = PhysicalObject(game, type + " tower", {x: posX, y: 0});
    
    /**
     * Tower global vars
     * TODO: move somewhere else
     */
    var PADDING_TOP = -8 + 75/2;//-8; // How far from the top of the page the tower is located
    var TURRET_SPACING = 18; // How close the turret is to the base - higher = closer
    
    
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
                model.destination = null;
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
        
        if (model.attacks) {
            // Fire a projectile every 55 ticks - TODO: intergrate rate of fire
            count++;
            if (count > 100) {
                count = 0;
                this.fire();
            }
        }
    };
    
    // Retrive the angle at which the turret is rotated
    // 0 is staight down, pi/2 is all the way to the left and -pi/2 is all the
    // to the right
    controller.getRotation = function() {
        return view.rotation;
    };
    
    // Rotate the towers turret to point at a new angle
    // 0 is staight down, pi/2 is all the way to the left and -pi/2 is all the
    // to the right
    // 
    // @params
    // angle - the new angle in the turret is pointed at (in radians)
    controller.setRotation = function(angle) {
        // Rotate the turret
        view.rotation = angle;
        
        // Move the turret around the base of the tower
        view.x = model.x - (Math.abs(view.base.width) / 2) * Math.sin(view.rotation) +  TURRET_SPACING * Math.sin(view.rotation);
        view.y = (Math.abs(view.base.height) + PADDING_TOP) * Math.cos(view.rotation) - (TURRET_SPACING + Math.abs(view.height) / 2)  * Math.cos(view.rotation);
    };
    
    // Causes the tower to fire a projectile
    controller.fire = function() {
        var angle = this.getRotation();
        projectiles.add(Projectile(game, "missile", {
            x: view.x - Math.abs(view.height) / 2 * Math.sin(angle), 
            y: view.y + Math.abs(view.height) / 2 * Math.cos(angle)
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
    var view = _superclass.v;
    view.anchor.setTo(0.5, 1);
    
    view.base = game.add.sprite(posX, PADDING_TOP, "tower base");
    
    // Set the sprite's anchor point to the center of the sprite
    view.base.anchor.setTo(0.5, 0.5);
    
    // Enable physics on base
    game.physics.arcade.enable(view.base);
    
    // Scale the sprite based upon the data defined in view_data
    view.base.scale.x = window.data.view_data["tower base"].scale.x;
    view.base.scale.y = window.data.view_data["tower base"].scale.y;
    
    // Set base image depending on the tower's type
    view.base.frameName = type + "-1.png";
    
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
