// UI (the stats display for tower, monsters, and possibly heroes)
function UI(game) {
    // Globals
    var UI_VERTICAL_OFFSET = -42;
    
    // Font objects
    var titleFont = {
        "font": "40px Komika Title"
    };
    var textFont = {
        "font": "26px Komika Text"
    };
    var textFontSmall = {
        "font": "20px Komika Text"
    };
    var textFontReallySmall = {
        "font": "14px Komika Text",
        align: "center" 
    };
    
    /**
     * Controller
     */
    var controller = {};
    
    // Update the UI - should be called each tick
    controller.update = function() {
        if (activeObj) {
            // 1. Display updated stats for the active object
            
            // See what type of object the active object is
            switch (activeObj.type) {
                case "Monster":
                    // Update the active object's health
                    statsViews[1].setText(activeObj.m.health + "/" + activeObj.m.maxHealth);
                    
                    break;
                
                case "Tower":
                    // Is tower not a null tower?
                    if (activeObj.m.rank != null) {
                        // Update the active object's time until experation
                        var secondsLeft = ("0" + Math.ceil(activeObj.m.time / 1000)
                                          ).slice(-2); // Format so that number always has two digits
                        statsViews[1].setText("0:" + secondsLeft);
                    }
                    
                    break;
            }
        }
    };
    
    // Change the active object (i.e. the object that the player wants to view
    // more info on)
    // @param obj - the new object to view (null for no object)
    controller.updateActiveObject = function(obj) {
        // Change the active object
        activeObj = obj;
        
        // Display the object's name
        name.setText(obj.m.type);
        
        // Display the object's flavor text
        flavor.setText("\""+obj.m.flavor+"\"");
        
        // Display the object's description text
        description.setText(obj.m.description);
        
        // See what type of object it is
        switch (obj.type) {
            case "Monster":
                
                // Initilize the monster's stats
                stats = [
                    {
                        "icon": "heart-icon",
                        "text": obj.m.health + "/" + obj.m.maxHealth,
                        "font": textFontSmall,
                        "offsetY": 42
                    }
                ];
                
                // Does monster have an upgrade option? If so display a stat
                // button for it
                if (obj.m.rank.length !== 3) {
                    // Find what monster this monster can be upgraded too
                    var upgradeName = window.data.upgrade_data.monsters[obj.m.rank+obj.m.rank[0]];
                    
                    // Add button to stats
                    stats.push({
                        "icon": "werewolf-icon",
                        "text": "upgrade to\n" + upgradeName,
                        "font": textFontReallySmall,
                        "offsetY": 46
                    });
                }
                
                break;
            
            case "Tower":
                // Is tower a destroyed tower?
                if (obj.m.rank == null) {
                    stats = [];
                    
                    // Find all rank 1 towers
                    for (var key in window.data.upgrade_data.towers) {
                        if (window.data.upgrade_data.towers.hasOwnProperty(key)) {
                            // Is this tower a rank 1 tower
                            if (key.length === 1) {
                                var towerName = window.data.upgrade_data.towers[key];
                                
                                // Add a stat button to build it
                                stats.push({
                                    "icon": "werewolf-icon",
                                    "text": "build\n" + towerName,
                                    "font": textFontReallySmall,
                                    "offsetY": 46
                                });
                            }
                        }
                    }
                    
                } else {
                    // Find out how much time the tower has left
                    var secondsLeft = "0:" + ("0" + Math.ceil(obj.m.time / 1000)
                                      ).slice(-2); // Format so that number always has two digits
                    
                    // Initilize the tower's stats
                    stats = [
                        {
                            "icon": "clock",
                            "text": secondsLeft,
                            "font": textFontSmall,
                            "offsetY": 42
                        }
                    ];
                    
                    // Does tower have an upgrade option? If so display a stat
                    // button for it
                    if (obj.m.rank.length !== 3) {
                        // Find what monster this tower can be upgraded too
                        var upgradeName = window.data.upgrade_data.towers[obj.m.rank+obj.m.rank[0]];
                        
                        // Add button to stats
                        stats.push({
                            "icon": "werewolf-icon",
                            "text": "upgrade to\n" + upgradeName,
                            "font": textFontReallySmall,
                            "offsetY": 46
                        });
                    }
                }
                
                break;
        }
        
        // Render object's stats
        this.renderStats();
    };
    
    // Renders the object specified in the value "stats" into UI buttons and
    // statistics
    controller.renderStats = function() {
        // Remove all previous stats
        for (var i = 0; i < statsViews.length; i++) {
            statsViews[i].destroy();
        }
        statsViews = [];
        
        // Interate through each stat creating an icon and text for each
        for (var i = 0; i < stats.length; i++) {
            // Get the specific stat for this iteration
            var stat = stats[i];
            
            // Get the x offset from the screen's center for this stat
            var offsetX = (stats.length - 1) / 2 * -90 + 90 * i;
            
            // Create an icon for that state
            var statIcon = game.add.sprite(game.width / 2 + offsetX, description.y + 60, stat.icon);
            statIcon.anchor.setTo(0.5, 0.5);
            statsViews.push(statIcon);
            
            // Create text for that icon
            var statText = game.add.text(game.width / 2 + offsetX, statIcon.y + stat.offsetY, stat.text, stat.font);
            statText.anchor.setTo(0.5);
            statsViews.push(statText);
        }
    };
    
    var activeObj = null;
    
    // Display amount of ice cream player has earned
    var icecreamIcon = game.add.sprite(game.width - 10, 10, "ice cream");
    icecreamIcon.anchor.setTo(1, 0);
    icecreamIcon.angle = 15;
    var icecreamAmount = game.add.text(game.width - 10 - 32, 10, "29", titleFont);
    icecreamAmount.anchor.setTo(1, 0);
    
    // Display how much research the player has
    var researchIcon = game.add.sprite(game.width - 10, 65, "research icon");
    researchIcon.anchor.setTo(1, 0);
    researchIcon.angle = -15;
    var researchAmount = game.add.text(game.width - 10 - 32, 65 + 5, "3", titleFont);
    researchAmount.anchor.setTo(1, 0);
    
    // Object's name
    var name = game.add.text(game.width / 2, game.height / 2 + UI_VERTICAL_OFFSET, "", titleFont);
    name.anchor.setTo(0.5, 0.5);
    
    // Object's flavor
    var flavor = game.add.text(game.width / 2, game.height / 2 + UI_VERTICAL_OFFSET, "", textFont);
    flavor.anchor.setTo(0.5, 0.5);
    
    // Object's description
    var description = game.add.text(game.width / 2, game.height / 2 + UI_VERTICAL_OFFSET, "", textFont);
    description.anchor.setTo(0.5, 0.5);
    
    // Vertically align text
    name.y = name.y - name.height - 4;
    description.y = description.y + description.height + 4;
    
    // Stats
    var stats = [];
    var statsViews = [];
    
    controller.renderStats();
    
    return controller;
}