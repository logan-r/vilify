// Monster class
function Monster(game, type) {
    // Inherits from FightingObject
    var _superclass = FightingObject(game, type, {x: 0, y: 0});
    
    /**
     * Monster actions/controller
     */
    var controller = _superclass.c;
    
    // Update the monster - performed on every tick of the game's clock
    controller.update = function() {
        // Move the monster if it has a destination
        if (model.destination !== null) {
            var deltaX = 0; // Amount to move on the x-axis
            
            // Is tower at destination?
            if (view.x > model.destination - 20 &&
                view.x < model.destination + 20 /* TODO: figure out better way to calculate margins */) {
                // Make sure tower is exactly at detination
                view.x = model.destination;
                
                // Don't move tower
                deltaX = 0;
                
                // Has reached destination so can set that property back to null
                model.destination = null;
            } else if (model.destination < view.x) { // Is target angle smaller or larger than current angle?
                // Need to subtract velocity from angle to reach destination
                deltaX = model.velocity * -1;
            } else if (model.destination > view.x) {
                // Need to add velocity to angle to reach destination
                deltaX = model.velocity;
            }
            
            view.body.velocity.x = deltaX;
        }
    };
    
    /**
     * Monster data/model
     */
    var model = _superclass.m;
    
    model.destination = 400;
    
    /**
     * Monster sprite/view
     */
    var view = _superclass.v;
    
    // Spawn monster in bottom right corner of screen
    view.x = game.width + Math.abs(view.width) / 2;
    view.y = game.height - Math.abs(view.height) / 2;
    
    view.body.velocity.x = 0;//-1 * model.velocity;
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Monster"
    };
}