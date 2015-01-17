// Object group class - contains a group of other objects
function ObjectGroup(game) {
    // items - the list of objects in the group
    var items = [];
    
    // views - a phaser group of sprites/views for layering/z-indexing purposes
    var views = game.add.group();
    
    var controller = {};
    
    // Adds an object to the group
    // obj - the object to add
    controller.add = function(obj) {
        items.push(obj);
        views.add(obj.v);
    };
    
    // Iterates over every object in this object group and call its update
    // function
    controller.update = function() {
        for (var i = 0; i < items.length; i++) {
            items[i].c.update();
        }
    };
    
    // Add in items to final object for debug purposes only
    // TODO: return only controller instead of _obj
    var _obj = controller;
    _obj.items = items;
    return _obj;
}