window.data = window.data || {}; // Make sure window.data is defined

var TOWER_X_SCALE = 0.18;
var TOWER_Y_SCALE = -0.18;

window.data.view_data = {
    // Heroes
    "soldier": {
        "image": "soldier",
        "scale": {
            "x": -0.3,
            "y": 0.3
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('walk/' , 1 , 18, '.png')
        }
    },
    "tank": {
        "image": "tank",
        "scale": {
            "x": -0.38,
            "y": 0.38
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('move/' , 1 , 9, '.png')
        }
    },
    "jet": {
        "image": "jet",
        "scale": {
            "x": -0.3,
            "y": 0.3
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('fly/' , 1 , 2, '.png')
        }
    },
    "helicopter": {
        "image": "helicopter",
        "scale": {
            "x": -0.35,
            "y": 0.35
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('fly/' , 1 , 2, '.png')
        }
    },
    
    // Monsters
    "werewolf": {
        "image": "werewolf",
        "scale": {
            "x": -0.35,
            "y": 0.35
        },
        "animations": {
            "move": Phaser.Animation.generateFrameNames('run/' , 1 , 13, '.png')
        }
    },
    
    // Towers
    "tower base": {
        "image": "tower base",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        }
    },
    "destroyed tower": {
        "image": "tower turret",
        "base_frame": "10.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "visible": false
    },
    "bullet tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        }
    },
    "slime tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x00ff00
    },
    "energy tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x00ffff
    },
    "missile tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x8a0707
    },
    "tornado tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x4c7a8a
    },
    "curse tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0xff00ff
    },
    "tesla tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x94d6ff
    },
    "radiation tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0xbfa900
    },
    "wormhole tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x3b2438
    },
    
    // Projectiles
    "missile": {
        "image": "missile",
        "scale": {
            "x": 0.35,
            "y": 0.35
        }
    },
    "fire missile": {
        "image": "missile",
        "scale": {
            "x": 0.35,
            "y": 0.35
        }
    },
    "slime": {
        "image": "slime",
        "animations": {
            "move": Phaser.Animation.generateFrameNames(1 , 8)
        },
        "scale": {
            "x": 0.25,
            "y": 0.25
        }
    },
    
    // Effects
    "explosion": {
        "image": "explosion",
        "animations": {
            "move": Phaser.Animation.generateFrameNames(1 , 21)
        },
        "scale": {
            "x": 0.7,
            "y": 0.7
        }
    },
    "fireball": {
        "image": "fireball",
        "animations": {
            "move": Phaser.Animation.generateFrameNames(1 , 31)
        },
        "scale": {
            "x": 0.5,
            "y": 0.5
        }
    },
    "splat": {
        "image": "splat",
        "animations": {
            "move": Phaser.Animation.generateFrameNames(1 , 11)
        },
        "scale": {
            "x": 0.5,
            "y": 0.5
        }
    },
    
    // Items
    "alien item": {
        "image": "alien item",
        "scale": {
            "x": 0.13,
            "y": 0.13
        }
    },
    "biochem item": {
        "image": "biochem item",
        "scale": {
            "x": 0.13,
            "y": 0.13
        }
    },
    "tech item": {
        "image": "tech item",
        "scale": {
            "x": 0.13,
            "y": 0.13
        }
    }
};