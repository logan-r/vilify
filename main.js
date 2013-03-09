// Vilify's main js file

// Game Constants
var FPS = 20; // The number of frames per second (the amount of time for second that things get updated)
var time = 0; // To keep track of time elapsed
var stage = document.getElementById('canvas').getContext('2d'); // Create a variable stage to draw upon
var TILE_LENGTH = 64; // The tile length (since it is awkward to call it a width or height)
var TILES = { // TILES "enum". Each property represents each number in map.json.
    WALKABLE: 0,
    UNWALKABLE: 1,
    START: 2,
    END: 3
}
var objectData;
xhrGet("objects.json", null, function(xhr) {
    objectData = JSON.parse(xhr.responseText);
});
var mapData; // The game map data
var Map; // The game map
xhrGet("map.json", null, function(xhr) {
    mapData = JSON.parse(xhr.responseText);
    Map = new GameMap(mapData.map1.mapArray);
    Map.waves = mapData.map1.waves;
});
var entities = []; // The array of all the entities.

// Create assetManager
assetManager = new AssetManager();

// Add files to assetManage
assetManager.addImage("Walkable Tile", "images/walkable.png");
assetManager.addImage("Unwalkable Tile", "images/unwalkable.png");
assetManager.addImage("Start Tile", "images/start.png");
assetManager.addImage("End Tile", "images/end.png");

/* Object constructors
------------------------------------------------------------------------------------------------------------------*/

function AssetManager() {
    /*
    Holds game assets (images, music, etc.) and makes sure they are all loaded before the game starts
    */
    
    // TODO: Add loading for music
    
    // Holds assets
    this.assets = {};
    
    // Holds asset file locations before they are loaded
    this.assetFiles = {}
    
    // Store the total assets so we know when it is done loading
    this.totalAssets = 0;
    
    // Store the currently loaded assets so we know when it is done loading
    this.loadedAssets = 0;
    
    // Keep track of if AssetManager is up to date (has loaded all files)
    this.upToDate = true; //starts true because it has loaded all 0 files
    
    this.addImage = function (imageName, imageFile) {
        /*
        imageName: a string that can later be used to get the image
        imageFile: the file location of the image
        */
        this.assets[imageName] = new Image();
        this.assets[imageName].onLoad = this.imageloaded;
        this.assetFiles[imageName] = imageFile;
        this.totalAssets++;
        this.upToDate = false;
    }
    
    this.imageLoaded = function () {
        this.loadedAssets++;
    }
    
    this.load = function (callback) {
        // Loop through assets
        for (var asset in this.assets) {
            // Make sure property is from assets not object
            if (this.assets.hasOwnProperty(asset)) {
                this.assets[asset].src = this.assetFiles[asset];
            }
        }

        // Call the callback function
        callback();
    }
    
    
    this.getAsset = function (assetName) {
        // Gets asset 'assetName'
        return this.assets[assetName];
    }
}

function Entity(type, dimension, img) {
    /*
    Stub class for representing entity in the game.
    This should never be invoked on its own.
    category: the object's category e.g. "monsters" or "towers"
    name: the object's name e.g. "Zombie" or "Vampire"
    dimension: object that contains x, y, width, height. Ex) {x: 0, y: 0, width: 64, height: 64}
    durability: how much life does this entity has.
    damage: damage
    range: range
    rate: rate of fire
    materials: materials needed
    update: stub method for update. Override recommended
    draw: stub method for draw. Override recommended
    img: image
    */
    // TODO: images!!!
    if (type) {
        this.category = type[0];
        this.name = type[1];
        data = objectData[this.category][this.name];
        this.durability = data.durability;
        this.damage = data.damage;
        this.range = data.range;
        this.rate = data.rate;
        this.materials = data.materials;
    }
    if (dimension) {
        this.x = dimension.x;
        this.y = dimension.y;
        this.width = dimension.width;
        this.height = dimension.height;
    }
    this.img = img;
}
Entity.prototype.update = function(elapsed) {
    this.width = randInt(100, 200);
    this.height = randInt(100, 200);
};
Entity.prototype.draw = function() {
    if (img) {
        stage.drawImage(this.img, this.x, this.y);
    } else {
        stage.fillStyle = "red";
        stage.fillRect(this.x, this.y, this.width, this.height);
    }
};

function Tower(name, dimension) { // Tower object constructor
    // TODO: Define some basic attributes that all towers can inherit

    if (objectData.towers[name] == undefined)
        throw "Tower: Invalid name: " + name;

    Entity.call(this, ["towers","name"], dimension);
}
Tower.prototype = new Entity(); // Set up prototype chain.

function Monster(name, dimension) { // Monster object constructor
    // TODO: Define some basic attributes that all monsters can inherit

    if (objectData.monsters[name] == undefined)
        throw "Monster: Invalid name: " + name;

    Entity.call(this, ["monsters",name], dimension);
}
Monster.prototype = new Entity(); // Set up prototype chain.

function Potion(name) { // Potion object constructor
    // TODO: Define some basic attributes that all potions can inherit

    if (objectData.potions[name] == undefined)
        throw "Potion: Invalid name: " + name;

    Entity.call(this, ["potions",name]);
}
Potion.prototype = new Entity(); // Set up prototype chain.

function Hero(name, dimension) { // Hero object constructor
    // TODO: Define some basic attributes that all heroes can inherit

    if (objectData.heroes[name] == undefined)
        throw "Hero: Invalid name: " + name;

    Entity.call(this, ["heroes",name], dimension);
}
Hero.prototype = new Entity(); // Set up prototype chain.

function GameMap(_map) {
    /*
    Game Map Class
    _map: a 2D array, 1 = a tile that can be walked on, 0 = a tile that can't be walked on
    draw: a function that displays the map
    */
    this._map = _map;
    this.draw = function() {
        //draw border
        stage.fillStyle = "black";
        stage.fillRect(0, 0, this._map.length * TILE_LENGTH + 10, this._map[0].length * TILE_LENGTH + 10);

        for (var row = 0; row < this._map.length; row++) { // Loop through the rows
            for (var column = 0; column < this._map[row].length; column++) { // Loop through the columns
                // get tile type
                var tileImage;
                switch (this._map[row][column]) {
                    case TILES.WALKABLE:
                        tileImage = assetManager.getAsset("Walkable Tile");
                        break;
                    case TILES.UNWALKABLE:
                        tileImage = assetManager.getAsset("Unwalkable Tile");
                        break;
                    case TILES.START:
                        tileImage = assetManager.getAsset("Start Tile");
                        break;
                    case TILES.END:
                        tileImage = assetManager.getAsset("End Tile");
                        break;
                    default:
                        throw "Invalid map!";
                }

                // draw a 64x64 tile in the correct location
                stage.drawImage(tileImage, column * TILE_LENGTH + 5, row * TILE_LENGTH + 5);
            }
        }
    }
}

// Global functions

function xhrGet(reqUri, type, callback) {
    /*
    General abstract function for getting resources
    reqUri: the uri of the resource
    type: the type of resource, pass "null" if the type is text
    callback: callback function
    */
    var xhr = new XMLHttpRequest();
    xhr.open("GET", reqUri, true);
    
    // If type is not null or undefined
    if (type) {
        xhr.responseType = type; // Default is text
    }
    
    xhr.onload = function() {
        if (callback) {
            try {
                callback(xhr);
            } catch (e) {
                throw "xhrGet failed: " + reqUri +
                    "\nException: " + e +
                    "\nResponseText: " + xhr.responseText;
            }
        }
    };
    
    xhr.send();
}

function randInt(low, high) {
    //generates a random number between (and including) low and high
    //should be useful later
    return (Math.floor(Math.random()*(high-low+1)))+low;
}

function update() {
    // TODO: Update the game entities

    var timeNow = new Date().getTime();
    if (time !== 0) {
        var elapsed = timeNow - time;
        for (var i in entities) {
            entities[i].update(elapsed);
        }
    }
    time = timeNow;
}

function draw() {
    // Clear stage so we can draw over it
    stage.clearRect(0, 0, stage.width, stage.height);
    
    // Draw background (currently just a solid color)
    stage.fillStyle = "black";
    stage.fillRect(0, 0, stage.width, stage.height);
    
    // Draw map
    Map.draw();

    // Draw entities
    for (var i in entities) {
        entities[i].draw();
    }
    
    // Draw menu
    stage.font = "40px Snowburst One";
    stage.fillStyle = "white";
    stage.fillText("Vilify", 485, 50);
}

function tick() {
    update();
    draw();
}

// Load images and start game when done
assetManager.load(function() {
    // Create a timer that calls a function, tick (which updates the game and draw), FPS times per second
    setInterval(tick, 1000/FPS);
});
