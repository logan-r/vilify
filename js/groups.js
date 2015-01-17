// Object group class - contains a group of other objects
function ObjectGroup(game) {
    // objs - the list of objects in the group
    var objs = [];
    
    // views - a phaser group of sprites/views for layering/z-indexing purposes
    var views = game.add.group();
    
    var controller = {};
    
    // Adds an object to the group
    // obj - the object to add
    controller.add = function(obj) {
        objs.push(obj);
        views.add(obj.v);
    };
    
    // Iterates over every object in this object group and call its update
    // function
    controller.update = function() {
        for (var i = 0; i < objs.length; i++) {
            objs[i].c.update();
        }
    };
    
    // Add in items to final object for debug purposes only
    // TODO: return only controller instead of _obj
    var _obj = controller;
    _obj.objs = objs;
    _obj.views = views;
    return _obj;
}

// Inventory group class - contains a group of items that the player owns
function InventoryGroup(game) {
    // Inherits from ObjectGroup
    var _superclass = ObjectGroup(game);
    
    // Globals
    // TODO: find better place to define
    var POS_X = game.width - 50; // the x location of the inventory
    var POS_Y = 50; // the y location of the inventory
    var SPACING_Y = 75; // the y-axis spacing between each item
    
    // Properties inherited from ObjectGroup
    var objs = _superclass.objs;
    var views = _superclass.views;
    
    var controller = _superclass;
    
    // Extend the add function so that it position the item in correct location
    // inside inventory
    controller.add = function(item) {
        // Extend from the ObjectGroup add function
        objs.push(item);
        views.add(item.v);
        
        // But detirmin the position of the item based upon what already in the
        // inventory
        item.v.x = POS_X;
        item.v.y = POS_Y + SPACING_Y * (objs.length - 1);
    };
    
    // Add in items to final object for debug purposes only
    // TODO: return only controller instead of _obj
    var _obj = controller;
    _obj.objs = objs;
    _obj.views = views;
    return _obj;
}