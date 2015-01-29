// Effect class
function Effect(game, type, pos) {
    // Inherits from GameObject
    var _superclass = GameObject(game, type, pos);
    
    /**
     * Item actions/controller
     */
    var controller = _superclass.c;
    
    // Update the item - called each tick
    controller.update = function() {
        // Check if effect is finished
        if (view.animations.currentAnim.isFinished) {
            // Destroy effect
            effects.remove(effects.getParentOfView(view));
        }
    };
    
    /**
     * Item data/model
     */
    var model = _superclass.m;
    
    /**
     * Item sprite/view
     */
    var view = _superclass.v;
    
    // Move sprite to correct location
    view.body.x = view.body.x - Math.abs(view.body.width) / 2;
    view.body.y = view.body.y - Math.abs(view.body.height);
    
    /**
     * Animation
     */
    
    // If effect has a "idle" animation sequence then play it
    if (model.viewInfo.hasOwnProperty("animations")) {
        view.animations.play("idle");
    }
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Effect"
    };
}