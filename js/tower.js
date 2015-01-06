// Tower class
function Tower(game, type) {
    /**
     * Tower data/model
     */
    var model = {
        type: type
    };

    /**
     * Tower sprite/view
     */
    var view = game.add.sprite(0, 0, type);

    // Set the sprite's anchor point to the center of the sprite
    view.anchor.setTo(0.5, 0.5);


    /**
     * Tower actions/controller
     */
    var controller = {};

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
