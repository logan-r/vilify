//vilify's main js file

//Game Constants
FPS = 20; //The number of frames per second (the amount of time for second that things get updated)

function Update() {
    //Updates the game objects
    
    //Draws the game objects
    Draw();
}

function Draw() {
    //Draws the game objects on the canvas
}

setInterval(Update, 1000/FPS); //Updates the game FPS times per second
