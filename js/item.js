// Item class
function Item(game, type, pos) {
    // Inherits from GameObject
    var _superclass = GameObject(game, type, pos);
    
    /**
     * Item actions/controller
     */
    var controller = _superclass.c;
    
    // Update the item - called each tick
    controller.update = function() {
        if (!view.input.isDragged) {
            // Each subclass should override this
            this.moveToDestination();
        }
    };
    
    // Handle the item begining to be dragged
    controller.handleDragStart = function() {
        // Empty for now
    };
    
    // Handle the item stopping being dragged
    controller.handleDragStop = function() {
        // Set the item's destination back to where it was before
        this.setDestination(model.previousDestination);
        
        // Check if the object collides with a tower
        game.physics.arcade.collide(view, towers.getBaseViewGroup(), null, this.handleUpgradeTower, this);
    };
    
    // Handle the item being dropped on a tower in order to upgrade it
    controller.handleUpgradeTower = function(itemView, towerView) {
        // Get the tower object that is to be upgraded
        var tower = towers.getParentOfView(towerView);
        
        // Get the item that is being used to upgrade the tower
        var item = inventory.getParentOfView(itemView);
        
        // Upgrade the tower
        var upgradeSuccessful = tower.c.upgrade(item.m.rank);
        
        if (upgradeSuccessful) {
            // If the upgrade was successful the item was used up, and should
            // be destroyed
            inventory.remove(item);
        }
    };
    
    /**
     * Item data/model
     */
    var model = _superclass.m;
    
    // Type to rank mappings
    model.type_ranks = {
        "tech item": "T",
        "biochem item": "C",
        "alien item": "A"
    };
    
    // Calculate the item rank (e.g. "T")
    model.rank = model.type_ranks[type];

    /**
     * Item sprite/view
     */
    var view = _superclass.v;
    
    // Allow item to be dragged
    view.inputEnabled = true;
    view.input.enableDrag(true);
    
    // Set up event hanlder for when the item starts and stops being dragged
    view.events.onDragStart.add(controller.handleDragStart, controller);
    view.events.onDragStop.add(controller.handleDragStop, controller);

    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Item"
    };
}
