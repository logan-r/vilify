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
        if (!obj) {
            return;
        }
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
    // Returns -1 if invalid index
    // @param index - the index of the item
    controller.get = function(index) {
        // Check to make sure index is valid
        if (index < 0 || index > objs.length - 1) {
            return -1;
        }
        
        return objs[index];
    };
    
    // Returns the index of an object within the group
    // if not found returns -1
    // @param obj - the object whose index you want to find
    controller.getIndex = function(obj) {
        // Iterate through each object in the list of objects, checking to see
        // if they match
        for (var i = 0; i < objs.length; i++) {
            if (obj === objs[i]) {
                return i;
            }
        }
        
        // No matches found, return -1
        return -1;
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