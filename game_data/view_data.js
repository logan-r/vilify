window.data = window.data || {}; // Make sure window.data is defined

window.data.view_data = {
    "werewolf": {
        "scale": {
            "x": -0.5,
            "y": 0.5
        }
    },
    "soldier": {
        "scale": {
            "x": -1,
            "y": 1
        }
    },
    "tank": {
        "scale": {
            "x": -0.5,
            "y": 0.5
        }
    },
    "jet": {
        "scale": {
            "x": -0.3,
            "y": 0.3
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('jet_fly000' , 1 ,  2 ,  '.png'),
            
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
            "x": 0.5,
            "y": -0.5
        }
    },
    "turret": {
        "scale": {
            "x": 0.5,
            "y": -0.5
        }
    }
};