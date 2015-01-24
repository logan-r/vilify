// Hero class
function Hero(game, type) {
    // Inherits from FightingObject
    var _superclass = FightingObject(game, type, {x: 0, y: 0});
    
    /**
     * Hero actions/controller
     */
    var controller = _superclass.c;
    
    // Update the hero - called each tick
    controller.update = function() {
        // Don't let hero move past monsters
        var collidesWithMonster = false;
        for (var i = 0; i < monsters.objs.length; i++) {
            var monster = monsters.objs[i];
            
            if (monster.c.inMeeleRange(view)) {
                collidesWithMonster = true;
                break;
            }
        }
        if (collidesWithMonster) {
            view.body.velocity.x = 0;
        } else {
            view.body.velocity.x = model.velocity;
        }
    }
    
    // Destroy this hero and remove it from the game world
    controller.destroy = function() {
        heroes.remove(heroes.getParentOfView(view));
    };
    
    // Causes the hero to fire a projectile
    // type - the type of projectile to fire
    controller.fire = function(type) {
        var angle = -Math.PI / 2;
        projectiles.add(Projectile(game, type, {
            x: view.x + Math.abs(view.width) / 2 + 100, 
            y: view.y - Math.abs(view.height) + 20
        }, angle));
    };
    
    /**
     * Hero data/model
     */
    var model = _superclass.m;
    
    /**
     * Hero sprite/view
     */
    var view = _superclass.v;
    
    // Spawn hero at left of screen
    view.x = 0 - Math.abs(view.width) / 2;
    
    // Set hero's movement speed
    view.body.velocity.x = model.velocity;
    
    /**
     * Init sprite
     */
    view.animations.play("move");
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "Hero"
    };
}