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
    
    /**
     * Animation
     */
    
    // If effect has a "move" animation sequence then play it
    if (model.viewInfo.hasOwnProperty("animations") && model.viewInfo.animations.hasOwnProperty("move")) {
        view.animations.add("move", model.viewInfo.animations.move, 20, false);
        view.animations.play("move");
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