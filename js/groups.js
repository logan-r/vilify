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
    
    // Removes an object from the group
    // obj - the object to be removed
    controller.remove = function(obj) {
        // TODO: implement re-use of dead sprites to avoid cost of creating
        // new sprites
        
        // Remove the object's view from views
        views.removeChild(obj.v);
        
        // Destroy the object's view
        obj.v.destroy();
        
        // Find the index of the object within objs
        var index = objs.indexOf(obj);
        
        // Remove the object from objs
        objs.splice(index, 1);
    };
    
    // Returns the object at a certain index in the group
    // index - the index of the item
    controller.get = function(index) {
        return objs[index];
    };
    
    // Iterates over every object in this object group and call its update
    // function
    controller.update = function() {
        for (var i = 0; i < objs.length; i++) {
            objs[i].c.update();
        }
    };
    
    // Returns the phaser sprite group in which all the objects' views are stored
    // Mainly for use with phaser functions
    controller.getViewGroup = function() {
        return views;
    };
    
    // Fetches and returns the parent object (if it exists) with in this group
    // view - the view to fetch the parent of
    controller.getParentOfView = function(view) {
        // Iterate through all objects in group, checking to see if the object's
        // view matches the view passed into this function
        for (var i = 0; i < objs.length; i++) {
            if (objs[i].v === view) {
                // If so return that object
                return objs[i];
            }
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
    var POS_X = game.width - 33 - 5; // the x location of the inventory
    var POS_Y = 67 + 5; // the y location of the inventory
    var SPACING_Y = 67 + 5; // the y-axis spacing between each item
    
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
        
        // But determine the destination location of the item based upon what is
        // already in the inventory
        item.c.setDestination({
            "x": POS_X,
            "y": POS_Y + SPACING_Y * (objs.length - 1)
        });
    };
    
    // Removes an object from the group
    // obj - the object to be removed
    // TODO: Should extend from ObjectGroup.remove since it is almost exactly
    // the same code just with an extra function call at the bottom
    controller.remove = function(obj) {
        // TODO: implement re-use of dead sprites to avoid cost of creating
        // new sprites
        
        // Remove the object's view from views
        views.removeChild(obj.v);
        
        // Destroy the object's view
        obj.v.destroy();
        
        // Find the index of the object within objs
        var index = objs.indexOf(obj);
        
        // Remove the object from objs
        objs.splice(index, 1);
        
        // Update the destinations of the items in the inventory now that there
        // is a new spot open in the list
        this.updateDestinations();
    };
    
    // Update the destinations of the items within the InventoryGroup, to reflect
    // changes that happened in the ordering of the items - such as if one of the
    // items from the middle of the group was deleted
    controller.updateDestinations = function() {
        for (var i = 0; i < objs.length; i++) {
            var item = objs[i];
            
            // Determine the destination location of the item based upon its index
            // in the list of objs
            item.c.setDestination({
                "x": POS_X,
                "y": POS_Y + SPACING_Y * i
            });
        }
    };
    
    // Add in items to final object for debug purposes only
    // TODO: return only controller instead of _obj
    var _obj = controller;
    _obj.objs = objs;
    _obj.views = views;
    return _obj;
}

// Tower group class - contains a group of towers
// Mostly like ObjectGroup exept has support for the multiple layers of sprites
// (i.e. base and turret) that towers contain
function TowerGroup(game) {
    // Inherits from ObjectGroup
    var _superclass = ObjectGroup(game);
    
    // Properties inherited from ObjectGroup
    var objs = _superclass.objs;
    var views = _superclass.views;
    var views_bases = game.add.group(); // A sprite group for the towers' bases
    
    var controller = _superclass;
    
    // Extend the add function so that it also adds the tower's base
    controller.add = function(item) {
        // Extend from the ObjectGroup add function
        objs.push(item);
        views.add(item.v);
        views_bases.add(item.v.base);
    };
    
    // Returns the phaser sprite group in which all the objects' base views are
    // stored
    // Mainly for use with phaser functions
    controller.getBaseViewGroup = function() {
        return views_bases;
    };
    
    // Fetches and returns the parent object (if it exists) with in this group
    // view - the view to fetch the parent of
    controller.getParentOfView = function(view) {
        // Iterate through all objects in group, checking to see if the object's
        // view matches the view passed into this function
        for (var i = 0; i < objs.length; i++) {
            if (objs[i].v === view || objs[i].v.base === view) {
                // If so return that object
                return objs[i];
            }
        }
    };
    
    // Add in items to final object for debug purposes only
    // TODO: return only controller instead of _obj
    var _obj = controller;
    _obj.objs = objs;
    _obj.views = views;
    _obj.views_bases = views_bases;
    return _obj;
}