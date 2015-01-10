window.data = window.data || {}; // Make sure window.data is defined

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
    "base": {
        "scale": {
            "x": 0.25,
            "y": -0.25
        }
    },
    "turret": {
        "scale": {
            "x": 0.25,
            "y": -0.25
        }
    }
};