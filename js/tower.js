// Tower class
function Tower(game, type, posX) {
    // Inherits from PhysicalObject
    var _superclass = PhysicalObject(game, "turret", {x: posX, y: 0});
    
    /**
     * Tower actions/controller
     */
    var controller = _superclass.c;
    
    // Rotate the towers turret to point at a new angle
    // 0 is staight down, pi/2 is all the way to the left and -pi/2 is all the
    // to the right
    // 
    // @params
    // angle - the new angle in the turret is pointed at (in radians)
    controller.rotate = function(angle) {
        // Rotate the turret
        view.turret.rotation = angle;
        
        // Move the turret around the base of the tower
        view.turret.x = model.x - (Math.abs(view.base.width) / 2) * Math.sin(view.turret.rotation);
        view.turret.y = Math.abs(view.base.height) * Math.cos(view.turret.rotation);
    };
    
    /**
     * Tower data/model
     */
    var model = _superclass.m;
    
    // The x position of the tower
    model.x = posX;

    /**
     * Tower sprite/view
     * Unlike most objects, towers have two sprites instead of one in its
     * view: one for its base and one for its turret
     */
    var view = {};
    view.turret = _superclass.v;
    view.turret.anchor.setTo(0.5, 1);
    
    view.base = game.add.sprite(posX, 0, "base");
    
    // Set the sprite's anchor point to the center of the sprite
    view.base.anchor.setTo(0.5, 1);
    
    // Scale the sprite based upon the data defined in view_data
    view.base.scale.x = window.data.view_data["base"].scale.x;
    view.base.scale.y = window.data.view_data["base"].scale.y;
    
    // Position and angle the turret
    controller.rotate(0);

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
