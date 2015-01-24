// Monster spawner class
function Spawner(game, posX) {
    // Inherits from InteractiveObject
    var _superclass = InteractiveObject(game, "spawner", {x: posX, y: game.height});
    
    /**
     * Spawner actions/controller
     */
    var controller = _superclass.c;
    
    // Cause the spawner to spawn a new monster
    // @param type - the type of monster to spawn
    controller.spawn = function(type) {
        // Create new monster
        var m = Monster(game, type, view.x - Math.abs(view.width) / 2);
        monsters.add(m);
        
        // Associate that monster with this spawner
        model.monster = m;
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
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Spawner"
    };
}