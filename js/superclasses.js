/**
 * GameObject class
 * Base class for anything in the game world
 * Parent class of Item and PhysicalObject
 */
function GameObject(game, type) {
    /**
     * Game object data/model
     */
    var model = {
        type: type
    };
    
    /**
     * Game object sprite/view
     */
    var view = game.add.sprite(0, 0, type);
    
    // Set the sprite's anchor point to the center of the sprite
    view.anchor.setTo(0.5, 0.5);
    
    /**
     * Game object actions/controller
     */
    var controller = {};
    
    /**
     * Generate object that is an instance of this class
     */
    return {
        m: model,
        v: view,
        c: controller,
        type: "GameObject"
    };
}