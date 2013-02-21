// Vilify's main js file

// Game Constants
var FPS = 20; // The number of frames per second (the amount of time for second that things get updated)
var stage = document.getElementById('canvas').getContext('2d'); // Create a variable stage to draw upon
var tileLength = 64; // The tile length (since it is awkward to call it a width or height)
var objects;
xhrGet("objects.json", null, function(xhr) {
    objects = JSON.parse(xhr.responseText);
});
var Map; // The game map
xhrGet("map.txt", null, function(xhr) {
    var data = xhr.responseText;
    if (!data) return null; // No data, return

    var array2D = [];

    // Trim trailing and leading whitespaces (including newlines),
    // and replace double newlines to single newline, and split it into lines.
    var lines = data.trim().replace(/\n\n/g, "\n").split("\n");

    for (var line in lines) {
        var vals = lines[line].trim().split(",");
        var row;

        if (vals[0].search("// ") !== 0) { // Not a comment
            row = [];
            for (var val in vals) {
                row.push(parseInt(vals[val]));
            }
            array2D.push(row);
        }
    }
    Map = new GameMap(array2D);
});

// Object constructors

function Tower() { // Tower object constructor
    // TODO: Define some basic attributs that all towers can inherit        
}

function Monster() { // Monster object constructor
    // TODO: Define some basic attributs that all monsters can inherit        
}

function Potion() { // Potion object constructor
    // TODO: Define some basic attributs that all potions can inherit        
}


function Hero() { // Hero object constructor
    // TODO: Define some basic attributes that all heroes can inherit
}

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

// Create the game map
//Map = new GameMap(loadMapFile("map.txt"));

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

function loadMapFile(filename) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", filename, false); // Might want to change this to do it asynchronously
    xhr.send();

    if (xhr.readyState === 4) { // 4 means DONE
        var data = xhr.responseText;
        if (!data) return null; // No data, return

        var array2D = [];

        // Trim trailing and leading whitespaces (including newlines),
        // and replace double newlines to single newline, and split it into lines.
        var lines = data.trim().replace(/\n\n/g, "\n").split("\n");

        for (var line in lines) {
            var vals = lines[line].trim().split(",");
            var row;

            if (vals[0].search("// ") !== 0) { // Not a comment
                row = [];
                for (var val in vals) {
                    row.push(parseInt(vals[val]));
                }
                array2D.push(row);
            }
        }
        return array2D;
    } else {
        return null;
    }
}

function randInt(low, high) {
    //generates a random number between (and including) low and high
    //should be useful later
    return (Math.floor(Math.random()*(high-low+1)))+low;
}

function update() {
    // TODO: Update the game objects
}

function draw() {
    // Clear stage so we can draw over it
    stage.clearRect(0, 0, stage.width, stage.height);
    
    // Draw background (currently just a solid color)
    stage.fillStyle = "black";
    stage.fillRect(0, 0, stage.width, stage.height);
    
    // Draw map
    Map.draw();
    
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
