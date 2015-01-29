// Projectile class
// @param targets - the group of FightingObjects the projectile collides with
// @param projectileType:
//  - bullet (hits one heroes; does nothing if it hits the ground)
//    * slime tower
//  - bomb (explodes when it hit the ground or a hero; deals AoE damage)
//    * missile tower
//    * energy tower?
//    * fire/bomb tower
//    * tornado tower?
//    * radiation tower
//  - ray (launches ray that instantly hits everything along a line from the tower to the ground)
//    * tesla tower
//  - TODO
//    * curse tower
//    * wormhole tower
function Projectile(game, type, targets, pos, angle) {
    // Inherits from AnimateObject
    var _superclass = AnimateObject(game, type, pos);
    
    /**
     * Projectile actions/controller
     */
    var controller = _superclass.c;
    
    // Update the projectile - performed on every tick of the game's clock
    controller.update = function() {
        // Calculate horizontal and vertical portions of velocity
        view.body.velocity.x = controller.getHorizontalVelocity();
        view.body.velocity.y = controller.getVerticalVelocity();
        
        this.applyGravity();
        
        this.collideGround();
        
        // Check if projectile has collided with a target
        game.physics.arcade.overlap(view, model.targets.getViewGroup(), null, this.handleCollideWithTarget, this);
    };
    
    // Projectile has hit some sort of target, now it should detonate or whatever
    controller.implode = function(pos) {
        // Only create effect if one is defined for this projectile in the modeldata file
        // Note: bomb projecitles must have effects as the effect is use to detirmine AoE
        if (model.hasOwnProperty("effect")) {
            // Create effect object
            var efct = Effect(game, model.effect, pos);
            
            // Add effect to effects group
            effects.add(efct);
            
            // Destroy projectile
            this.destroy();
            
            // If bomb apply AoE damage here
            if (model.projectileType == "bomb") {
                // Called on every target that the effect collides with
                var handleHitTarget = function(effectSprie, targetSprite) {
                    var target = targets.getParentOfView(targetSprite);
                    
                    this.attackTarget(target);
                };
                
                // Check to see which targets were hit
                game.physics.arcade.overlap(efct.v, targets.getViewGroup(), null, handleHitTarget, this);
            }
        } else {
            // Destroy projectile
            this.destroy();
        }
    };
    
    // Check to see if projectile has hit ground yet
    controller.collideGround = function() {
        if (view.y >= GROUND_LEVEL) {
            switch (model.projectileType) {
                case "bomb":
                    // Bombs explode when they hit the ground
                    this.implode({x: view.x, y: GROUND_LEVEL});
                    break;
                
                case "bullet":
                    // Bullet don't do anything when they hit the ground
                    this.destroy();
                    break;
                
                default:
                    // Error!
                    break;
            }
        }
    };
    
    // Change the projectiles angle based on its mass
    // TODO: base this on projectile mass
    controller.applyGravity = function() {
        // Keep the projectile's angle within it initial quadrant
        if (view.body.angularVelocity < 0 && view.angle < 0) {
            view.body.angularVelocity = 0;
            view.body.angularAcceleration = 0;
            view.rotation = 0;
        } else if (view.body.angularVelocity > 0 && view.angle > 0) {
            view.body.angularVelocity = 0;
            view.body.angularAcceleration = 0;
            view.rotation = 0;
        }
    };
    
    // Destroy this projectile and remove it from the game world
    controller.destroy = function() {
        projectiles.remove(projectiles.getParentOfView(view));
    };
    
    // Calculate the horizontal portion of the projectiles total velocity based
    // upon the angle that the projecitle is point in
    controller.getHorizontalVelocity = function() {
        // Calculate vertical component of total velocity
        return -Math.sin(view.rotation) * model.velocity;
    };
    
    // Calculate the verticle portion of the projectiles total velocity based
    // upon the angle that the projecitle is point in
    controller.getVerticalVelocity = function() {
        // Calculate vertical component of total velocity
        return Math.cos(view.rotation) * model.velocity;
    };
    
    // Projectile has collided with a target
    controller.handleCollideWithTarget = function(projectileView, targetView) {
        var target = targets.getParentOfView(targetView);
        
        switch (model.projectileType) {
            case "bomb":
                // Animate explosion effect
                this.implode({x: view.x, y: target.v.y});
                
                break;
            
            case "bullet":
                // Animate explosion effect
                this.implode({x: view.x, y: view.y});
                
                // Attack the target that was hit
                this.attackTarget(target);
                
                break;
            
            default:
                // Error!
                break;
        }
    };
    
    // Attack a target that the projectile has hit
    // @param target - the target that was hit
    controller.attackTarget = function(target) {
        // Apply effect to target, if acceptable
        if (model.hasOwnProperty("status")) {
            target.c.applyStatus(model.status);
        }
        
        // Damage hero
        target.c.damage(model.damage);
    };
    
    /**
     * Projectile data/model
     */
    var model = _superclass.m;
    
    // Total velocity of projectile
    model.velocity = 500;
    
    // Intial angle of the projectile
    model.initialAngle = angle;
    
    // Save the projectile's targets
    model.targets = targets;
    
    /**
     * Projectile sprite/view
     */
    var view = _superclass.v;
    
    // Projecitle should be pointing in the param "Angle" that was passed to this contructor
    // Note: angle is in radians
    view.rotation = angle;
    
    // The rate at which the angle changes
    if (angle < 0) {
        view.body.angularAcceleration = 50 * Math.cos(angle);
    } else if (angle > 0) {
        view.body.angularAcceleration = 50 * -Math.cos(angle);
    }
    
    // Calculate vertical and horizontal portions of velocity based upon angle
    // and total velocity
    view.body.velocity.x = controller.getHorizontalVelocity();
    view.body.velocity.y = controller.getVerticalVelocity();
    
    /**
     * Animation
     */
    
    // If projectile has "idle" animation, play it
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
        type: "Projectile"
    };
}