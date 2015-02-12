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
            // Check if activeObject's level differce from activeObject's level 
            // from last tick, if so refresh display
            if (previousActiveObjLevel != activeObj.m.level) {
                this.setActiveObject(activeObj);
            }
            
            // Display updated stats for the active object
            // See what type of object the active object is
            switch (activeObj.type) {
                case "Spawner":
                    var monster = activeObj.m.monster;
                    
                    if (monster) {
                        // Update the active object's health
                        statsViews[1].setText(monster.m.health + "/" + monster.m.maxHealth);
                    }
                    
                    break;
                
                case "Tower":
                    // Is tower not a null tower?
                    if (activeObj.m.level != null) {
                        // Update the active object's time until experation
                        var secondsLeft = ("0" + Math.ceil(activeObj.m.time / 1000)
                                          ).slice(-2); // Format so that number always has two digits
                        statsViews[1].setText("0:" + secondsLeft);
                    }
                    
                    break;
            }
            
            // Update previousActiveObjecLevel
            previousActiveObjLevel = activeObj.m.level;
        }
    };
    
    // Change the active object (i.e. the object that the player wants to view
    // more info on)
    // @param obj - the new object to view (null for no object)
    controller.setActiveObject = function(obj) {
        if (activeObj) {
            // Unhighlight previous active object
            activeObj.c.unhighlight();
        }
        
        // Highlight the new active object
        obj.c.highlight();
        
        // Change the active object
        activeObj = obj;
        previousActiveObjLevel = obj.m.level;
        
        // See what type of object it is
        switch (obj.type) {
            case "Spawner":
                // Get the monster associated with the spawner
                var monster = obj.m.monster;
                
                // Is it an empty spawner?
                if (monster === null) {
                    // Display the spawner's name
                    name.setText(obj.m.type);
            
                    // Display the spawner's flavor text
                    flavor.setText("\"" + obj.m.flavor + "\"");
                    
                    // Display the spawner's description text
                    description.setText(obj.m.description);
                    
                    // Display the categories of monsters that can be spawned
                    stats = [];
                    for (var category in window.data.upgrade_data.monsters) {
                        if (window.data.upgrade_data.monsters.hasOwnProperty(category)) {
                            // Add a stat button to build it
                            stats.push({
                                "icon": category + " category icon",
                                "text": "spawn\n" + category,
                                "font": textFontReallySmall,
                                "offsetY": 46
                            });
                        }
                    }
                } else {
                    // Display the monster's name
                    name.setText(monster.m.type);
            
                    // Display the monster's flavor text
                    flavor.setText("\"" + monster.m.flavor + "\"");
                    
                    // Display the monster's description text
                    description.setText(monster.m.description);
                    
                    // Initilize the monster's stats
                    stats = [
                        {
                            "icon": "health icon",
                            "text": monster.m.health + "/" + monster.m.maxHealth,
                            "font": textFontSmall,
                            "offsetY": 42
                        },
                        {
                            "icon": "level icon",
                            "text": "level " + monster.m.level,
                            "font": textFontSmall,
                            "offsetY": 42
                        }
                    ];
                    
                    // Does monster have an upgrade option? If so display a stat
                    // button for it
                    if (monster.m.level !== 3) {
                        // Add button to stats
                        stats.push({
                            "icon": "upgrade icon",
                            "text": "upgrade",
                            "font": textFontSmall,
                            "offsetY": 42
                        });
                    }
                }
                
                break;
            
            case "Tower":
                // Display the tower's name
                name.setText(obj.m.type);
        
                // Display the tower's flavor text
                flavor.setText("\"" + obj.m.flavor + "\"");
                
                // Display the tower's description text
                description.setText(obj.m.description);
                
                // Is tower a destroyed tower?
                if (obj.m.level == null) {
                    stats = [];
                    
                    // Find all tower
                    for (var category in window.data.upgrade_data.towers) {
                        if (window.data.upgrade_data.towers.hasOwnProperty(category)) {
                                // Add a stat button to build it
                                stats.push({
                                    "icon": category + " category icon",
                                    "text": "build\n" + category + " tower",
                                    "font": textFontReallySmall,
                                    "offsetY": 46
                                });
                        }
                    }
                    
                } else {
                    // Find out how much time the tower has left
                    var secondsLeft = "0:" + ("0" + Math.ceil(obj.m.time / 1000)
                                      ).slice(-2); // Format so that number always has two digits
                    
                    // Initilize the tower's stats
                    stats = [
                        {
                            "icon": "time icon",
                            "text": secondsLeft,
                            "font": textFontSmall,
                            "offsetY": 42
                        },
                        {
                            "icon": "level icon",
                            "text": "level " + obj.m.level,
                            "font": textFontSmall,
                            "offsetY": 42
                        }
                    ];
                    
                    // Does tower have an upgrade option? If so display a stat
                    // button for it
                    if (obj.m.level !== 3) {
                        // Add button to stats
                        stats.push({
                            "icon": "upgrade icon",
                            "text": "upgrade",
                            "font": textFontSmall,
                            "offsetY": 42
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
    var previousActiveObjLevel = null;
    
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