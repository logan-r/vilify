// UI (the stats display for tower, monsters, and possibly heroes)
function UI(game) {
    // Globals
    var UI_VERTICAL_OFFSET = -42;
    var TOWER_HEALTH_ICON = "clock";
    var MONSTER_HEALTH_ICON = "heart-icon";
    
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
        // 1. Display updated stats for the active object
        
        // See what type of object the active object is
        switch (activeObj.type) {
            case "Monster":
                // Update the active object's health
                //healthAmount.setText(activeObj.m.health + "/" + activeObj.m.maxHealth);
                
                break;
                
            
            case "Tower":
                // Update the active object's time until experation
                var secondsLeft = ("0" + Math.ceil(activeObj.m.time / 1000)
                                  ).slice(-2); // Format so that number always has two digits
                //healthAmount.setText("0:" + secondsLeft);
                
                break;
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
                // Display the object's health
                //healthIcon.loadTexture(MONSTER_HEALTH_ICON);
                //healthAmount.setText(obj.m.health + "/" + obj.m.maxHealth);
                
                break;
            
            case "Tower":
                // Display how much time the tower has left
                //healthIcon.loadTexture(TOWER_HEALTH_ICON);
                //healthAmount.setText("0:26");;
                
                break;
        }
    };
    
    // Renders the object specified in the value "stats" into UI buttons and
    // statistics
    controller.renderStats = function() {
        // Remove all previous stats
        statsView.removeChildren();
        
        // Interate through each stat creating an icon and text for each
        for (var i = 0; i < stats.length; i++) {
            // Get the specific stat for this iteration
            var stat = stats[i];
            
            // Get the x offset from the screen's center for this stat
            var offsetX = (stats.length - 1) / 2 * -90 + 90 * i;
            
            // Create an icon for that state
            var statIcon = game.add.sprite(game.width / 2 + offsetX, description.y + 60, stat.icon);
            statIcon.anchor.setTo(0.5, 0.5);
            
            // Create text for that icon
            var statText = game.add.text(game.width / 2 + offsetX, statIcon.y + stat.offsetY, stat.text, stat.font);
            statText.anchor.setTo(0.5);
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
    
    /*var healthIcon = game.add.sprite(game.width / 2 - 45, description.y + 60, MONSTER_HEALTH_ICON);
    healthIcon.anchor.setTo(0.5, 0.5);
    
    // Object's stats
    var healthAmount = game.add.text(game.width / 2 - 45, healthIcon.y + 42, "14/20", textFontSmall);
    healthAmount.anchor.setTo(0.5, 0.5);*/
    
    var stats = [
        {
            "icon": "heart-icon",
            "text": "0:30",
            "font": textFontSmall,
            "offsetY": 42
        },
        {
            "icon": "werewolf-icon",
            "text": "upgrade to\nWerewolf",
            "font": textFontReallySmall,
            "offsetY": 46
        },
        {
            "icon": "werewolf-icon",
            "text": "upgrade to\nZombie",
            "font": textFontReallySmall,
            "offsetY": 46
        }
    ];
    
    var statsView = game.add.group();
    
    /*var clock = game.add.sprite(game.width / 2 + 45, description.y + 60, "werewolf-icon");
    clock.anchor.setTo(0.5, 0.5);*/
    
    // Divider
    /*var div = game.add.graphics(0, 0);
    div.beginFill(0x000000, 1);
    div.drawRect(game.width / 2 - 1, ((clock.y + 46) + (description.y + 60)) / 2 - 40, 1, 80);*/
    
    // Object's stats
    /*var timeStat = game.add.text(game.width / 2 + 45, clock.y + 46, "upgrade to\nWerewolf", textFontReallySmall);
    timeStat.anchor.setTo(0.5);*/
    
    controller.renderStats();
    
    return controller;
}