// Monster spawner class
function Spawner(game, posX) {
    // Inherits from InteractiveObject
    var _superclass = InteractiveObject(game, "spawner", {x: posX, y: game.height});
    
    /**
     * Spawner actions/controller
     */
    var controller = _superclass.c;
    
    // Cause the spawner to spawn a new monster
    // @param category - the category of monster to spawn
    controller.spawn = function(category) {
        // Create new monster
        var m = Monster(game, category, view.x - Math.abs(view.width) / 2, _self);
        monsters.add(m);
        
        // Associate that monster with this spawner
        model.monster = m;
    };
    
    // Highlight the spawner to show that it is selected
    controller.highlight = function() {
        view.highlight = game.add.graphics(0, 0);
        view.highlight.beginFill(0x6f5092, 1);
        view.highlight.drawRect(view.x - Math.abs(view.width), game.height - FLOOR_HEIGHT + 1, Math.abs(view.width), FLOOR_HEIGHT - 1);
        highlights.add(view.highlight);
    };
    
    // Remove the spawner's highlight to show that it is no longer selected
    controller.unhighlight = function() {
        if (view.highlight) {
            view.highlight.destroy();
        }
    };
    
    // Handle the spawner being tapped/clicked
    controller.handleInputDown = function(view, pointer) {
        ui.setActiveObject(_self);
    };
    
    /**
     * Spawner data/model
     */
    var model = _superclass.m;
    
    // The monster spawned from this spawner, null means no monster has been spawned
    // (or a monster was spawned but it died)
    model.monster = null;
    
    /**
     * Spawner sprite/view
     */
    var view = _superclass.v;
    
    // Init spawner highlight (null for none currently)
    view.highlight = null;
    
    // Setup event handling
    view.inputEnabled = true;
    view.events.onInputDown.add(controller.handleInputDown, controller);
    
    /**
     * Generate object that is an instance of this class
     */
    var _self = {
        m: model,
        v: view,
        c: controller,
        type: "Spawner"
    }; return _self;
}