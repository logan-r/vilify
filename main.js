// Vilify's main js file

// Game Constants
var FPS = 20; // The number of frames per second (the amount of time for second that things get updated)
var time = 0; // To keep track of time elapsed
var stage = document.getElementById('canvas').getContext('2d'); // Create a variable stage to draw upon
var tileLength = 64; // The tile length (since it is awkward to call it a width or height)
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
var entityType = {
    TOWER: 0,
    MONSTER: 1,
    POTION: 2,
    HERO: 3
}

// Object constructors

function Entity(type, dimension, durability, damage, range, rate, materials) {
    /*
    Stub class for representing entity in the game.
    This should never be invoked on its own.
    entityType: entity type from objectData
    dimension: object that contains x, y, width, height. Ex) {x: 0, y: 0, width: 64, height: 64}
    durability: ???
    damage: damage
    range: range
    rate: rate of fire
    materials: materials needed
    update: stub method for update. Override recommended
    draw: stub method for draw. Override recommended
    */

    this.entityType = type;
    this.x = dimension.x;
    this.y = dimension.y;
    this.width = dimension.width;
    this.height = dimension.height;
    this.durability = durability;
    this.damage = damage;
    this.range = range;
    this.rate = rate;
    this.materials = materials;

    this.update = function(elapsed) {

    };

    this.draw = function(elapsed) {

    };
}

function Tower() { // Tower object constructor
    // TODO: Define some basic attributs that all towers can inherit

    Entity.
}
Tower.prototype = new Entity();

function Monster() { // Monster object constructor
    // TODO: Define some basic attributs that all monsters can inherit        
}
Monster.prototype = new Entity();

function Potion() { // Potion object constructor
    // TODO: Define some basic attributs that all potions can inherit        
}
Potion.prototype = new Entity();

function Hero() { // Hero object constructor
    // TODO: Define some basic attributes that all heroes can inherit
}
Hero.prototype = new Entity();

function GameMap(_map) {
    /*
    Game Map Class
    _map: a 2D array, 1 = a tile that can be walked on, 0 = a tile that can't be walked on
    draw: a function that displays the map 
    */
    this._map = _map;
    this.draw = function() {
        for (var row = 0; row < this._map.length; row++) { // Loop through the rows
            for (var column = 0; column < this._map[row].length; column++) { // Loop through the columns
                // get tile color
                if (this._map[row][column] === 1) { // on path tile
                    stage.fillStyle = "white"; //TODO: add images instead of color
                } else { // not on path tile
                    stage.fillStyle = "grey"; //TODO: add images instead of color
                }
                
                // draw a 64x64 tile in the correct location
                stage.fillRect(row * tileLength + 2, column * tileLength + 2, tileLength, tileLength);
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

// Create a timer that calls a function, tick (which updates the game and draw), FPS times per second
setInterval(tick, 1000/FPS);
