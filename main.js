//vilify's main js file

//Game Constants
var FPS = 20; //The number of frames per second (the amount of time for second that things get updated)
var stage = document.getElementById('canvas').getContext('2d'); //create a variable stage to draw upon

function Update() {
    //TODO: Update the game objects
    
    //Draw the game objects
    Draw();
}

function Draw() {
    //TODO: Draw the game objects on the canvas
}

setInterval(Update, 1000/FPS); //Updates the game FPS times per second
