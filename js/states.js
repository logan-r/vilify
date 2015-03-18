window.states = {};

// In this state the actual game is being played
window.states.game = {
    create: function() {
        // Create game object groups
        window.floor = null;
        window.highlights = null;
        window.spawners = null;
        window.ui = null;
        window.projectiles = null;
        window.towers = null;
        window.monsters = null;
        window.heroes = null;
        window.effects = null;
        
        // Init input trackers
        window.wasDown = false;
        
        // Init globals
        GROUND_LEVEL = game.height - FLOOR_HEIGHT / 2 + 4;
        
        // Set world bounds
        game.world.setBounds(-2000, 0, game.world.width + 2000 * 2, game.world.height);
        
        // Init the arcade physics engine
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Set game's background
        game.stage.backgroundColor = 0xe5e5e5;
        
        // Setup the floor
        floor = game.add.graphics(0, 0);
        floor.beginFill(0x000000, 1);
        floor.drawRect(0, game.height - FLOOR_HEIGHT, game.width, 1);
        floor = game.add.graphics(0, 0);
        floor.beginFill(0xdddddd, 1);
        floor.drawRect(0, game.height - FLOOR_HEIGHT + 1, game.width, FLOOR_HEIGHT - 1);
        
        // Create highlights sprite group
        highlights = game.add.group();
        
        // Create spawner group
        spawners = ObjectGroup(game);
        for (var i = 0; i < 3; i++) {
            spawners.add(Spawner(game, (game.width - 120) / 3 * (i+1)));
        }
        
        // Create UI
        ui = UI(game);
        
        // Create projecitle group
        projectiles = ObjectGroup(game);
        
        // Create towers group
        towers = TowerGroup(game);
        for (var i = 0; i < 4; i++) {
            towers.add(Tower(game, null, 110+210*i));
        }
        
        // Create monsters group
        monsters = ObjectGroup(game);
        
        // Create heroes group
        heroes = ObjectGroup(game);
        heroes.add(Hero(game, "ninja"));
        
        // Create effects group
        effects = ObjectGroup(game);
	},
	
	update: function() {
        // Update game objects
        projectiles.update();
        towers.update();
        monsters.update();
        heroes.update();
        effects.update();
        ui.update();
        
        // Handle mouse/touch input
        if (game.input.activePointer.isDown) {
            // Interate through each tower checking if the player is
            // rotating that tower's turret
            for (var i = 0; i < towers.objs.length; i++) {
                var tower = towers.objs[i];
                if (tower.m.beingDragged) {
                    // If so, make the turret point toward the mouse pointer
                    tower.c.setRotationFromPosition(game.input.activePointer.position);
                }
            }
        }
        
         // Handle mouse/touch input
        if (game.input.activePointer.isDown && !window.wasDown) {
            // Iterate through the UI buttons, checking to see if any have been clicked
            for (var i = 0; i < ui.statsViews.length; i++) {
                // Check if a button is clicked
                if (ui.statsViews[i].input.checkPointerDown(game.input.activePointer, true)) {
                    // Fetch the stat associated with the clicked button
                    var stat = ui.statsViews[i].stat;
                    
                    // If there is an action asscociated with the button call it
                    if (stat.hasOwnProperty("action")) {
                        stat.action();
                    }
                }
            }
        }
        
        // Update the mouse's previous state
        window.wasDown = game.input.activePointer.isDown;
        
        // Spawn heroes at random - for debuging
        /*if (Math.random() > 0.9973) {
            var types = ["soldier", "tank"]; //["soldier", "soldier", "soldier", "soldier", "soldier", "soldier", "tank", "tank", "tank", "tank", "jet", "helicopter"];
            heroes.add(Hero(game, types[MathEx.randInt(0, types.length - 1)]));
        }*/
	},
	
	render: function() {
	    // Debug physic bodies
        /*for (var i = 0; i < monsters.views.children.length; i++) {
            game.debug.body(monsters.views.children[i]);
        }
        
        for (var i = 0; i < projectiles.views.children.length; i++) {
            game.debug.body(projectiles.views.children[i]);
        }*/
	}
};

// In this state the game is initialized
window.states.boot = {
    preload: function() {
        // Load game logo
        game.load.image("loading", "/images/loading.png");
	},
  	create: function() {
        // Set the background color to white
        game.stage.backgroundColor = 0xffffff;
		
		// Check if a mobile device is being used
		if (game.device.desktop === false)
        {
            // Handle game scaling for the mobile device
            game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
            game.scale.pageAlignHorizontally = true;
            game.scale.pageAlignVertically = true;
            
            // Attempt to force landscape screen orientation
            game.scale.forceOrientation(true, false);
            
            // TODO: setup event handlers for screen orientation changes
            //game.scale.enterIncorrectOrientation.add(this.enterIncorrectOrientation, this);
            //game.scale.leaveIncorrectOrientation.add(this.leaveIncorrectOrientation, this);
        }
        
        // Start loading game assets
		game.state.start("preload");
	}
};

// In this state the game loads the assets it needs
window.states.preload = {
  	preload: function() {
  	    // Add loading bar
  	    var loadingBar = game.add.sprite(game.width / 2, game.height / 2, "loading");
        loadingBar.anchor.setTo(0.5, 0.5);
        game.load.setPreloadSprite(loadingBar);
        
        // Load tower sprites
        game.load.atlasJSONHash('tower base', '/images/base/sheet.png', '/images/base/data.json');
        game.load.atlasJSONHash('tower turret', '/images/turret/sheet.png', '/images/turret/data.json');
        
        // Load monster sprites
        game.load.atlasJSONHash('scrapyard robot', '/images/scrapyard_robot/sheet-md.png', '/images/scrapyard_robot/data-md.json');
        game.load.atlasJSONHash('wasp', '/images/wasp/sheet-md.png', '/images/wasp/data-md.json');
        game.load.atlasJSONHash('invader', '/images/invader/sheet-md.png', '/images/invader/data-md.json');
        game.load.atlasJSONHash('sentinel', '/images/sentinel/sheet-md.png', '/images/sentinel/data-md.json');
        game.load.atlasJSONHash('zombie bunny', '/images/zombie_bunny/sheet-md.png', '/images/zombie_bunny/data-md.json');
        game.load.atlasJSONHash('exterminator', '/images/exterminator/sheet-md.png', '/images/exterminator/data-md.json');
        game.load.atlasJSONHash('talos', '/images/talos/sheet-md.png', '/images/talos/data-md.json');
        game.load.atlasJSONHash('werewolf', '/images/werewolf/sheet-md.png', '/images/werewolf/data-md.json');
        game.load.atlasJSONHash('overlord', '/images/overlord/sheet-md.png', '/images/overlord/data-md.json');
        
        // Load hero sprites
        game.load.atlasJSONHash('soldier', '/images/soldier/sheet.png', '/images/soldier/data.json');
        game.load.atlasJSONHash('tank', '/images/tank/sheet.png', '/images/tank/data.json');
        game.load.atlasJSONHash('ninja', '/images/ninja/sheet-50percent.png', '/images/ninja/data-50percent.json');
        game.load.atlasJSONHash('helicopter', '/images/helicopter/sheet.png', '/images/helicopter/data.json');
        game.load.atlasJSONHash('jet', '/images/jet/sheet.png', '/images/jet/data.json');
        
        // Load projectiles images/sprites
        game.load.image('missile', '/images/projectiles/red2.png');
        game.load.image('tank missile', '/images/projectiles/green2.png');
        game.load.image('laser', '/images/projectiles/laser.png');
        game.load.atlasJSONHash('slime', '/images/slime/sheet.png', '/images/slime/data.json');
        
        // Load effect sprites
        game.load.atlasJSONHash('explosion', '/images/explosion/sheet.png', '/images/explosion/data.json');
        game.load.atlasJSONHash('fireball', '/images/fireball/sheet.png', '/images/fireball/data.json');
        game.load.atlasJSONHash('tornado', '/images/tornado/sheet.png', '/images/tornado/data.json');
        game.load.atlasJSONHash('splat', '/images/splat/sheet.png', '/images/splat/data.json');
        
        // Load interactive elements images/sprites
        game.load.image('spawner', '/images/spawner/spawner.png');
        game.load.image('machine', '/images/machine.png');
        
        // Load icons
        game.load.image('research icon', '/images/research.png');
        game.load.image('ice cream', '/images/icecream.png');
        game.load.image('alien category icon', '/images/icon/alien.png');
        game.load.image('robot category icon', '/images/icon/robot.png');
        game.load.image('beast category icon', '/images/icon/beast.png');
        game.load.image('war category icon', '/images/icon/war.png');
        game.load.image('storm category icon', '/images/icon/storm.png');
        game.load.image('arcane category icon', '/images/icon/arcane.png');
        game.load.image('health icon', '/images/icon/health.png');
        game.load.image('time icon', '/images/icon/time.png');
        game.load.image('level icon', '/images/icon/level.png');
        game.load.image('upgrade icon', '/images/icon/upgrade.png');
	},
  	create: function() {
        // Start the game
		game.state.start("game");
	}
};