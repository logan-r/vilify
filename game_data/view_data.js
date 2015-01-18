window.data = window.data || {}; // Make sure window.data is defined

var TOWER_X_SCALE = 0.18;
var TOWER_Y_SCALE = -0.18;

window.data.view_data = {
    "soldier": {
        "scale": {
            "x": -0.5,
            "y": 0.5
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('walk/' , 1 , 18, '.png')
        }
    },
    "tank": {
        "scale": {
            "x": -0.5,
            "y": 0.5
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('move/' , 1 , 9, '.png')
        }
    },
    "jet": {
        "scale": {
            "x": -0.3,
            "y": 0.3
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('fly/' , 1 , 2, '.png')
        }
    },
    "helicopter": {
        "scale": {
            "x": -0.5,
            "y": 0.5
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('fly/' , 1 , 2, '.png')
        }
    },
    "werewolf": {
        "scale": {
            "x": -0.5,
            "y": 0.5
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('run/' , 1 , 13, '.png')
        }
    },
    "scrapyard robot": {
        "scale": {
            "x": -0.8,
            "y": 0.8
        }
    },
    "missile": {
        "scale": {
            "x": 0.4,
            "y": 0.4
        }
    },
    "tower base": {
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        }
    },
    "destroyed tower": {
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "visible": false
    },
    "bullet tower": {
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        }
    },
    "alien item": {
        "scale": {
            "x": 0.13,
            "y": 0.13
        }
    },
    "biochem item": {
        "scale": {
            "x": 0.13,
            "y": 0.13
        }
    },
    "tech item": {
        "scale": {
            "x": 0.13,
            "y": 0.13
        }
    }
};