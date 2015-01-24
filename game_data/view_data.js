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
            "move": {
                "frames": Phaser.Animation.generateFrameNames('walk/' , 1 , 18, '.png')
            },
            "fire": {
                "frames": Phaser.Animation.generateFrameNames('shoot/' , 2 , 3, '.png')
            }
        }
    },
    "tank": {
        "image": "tank",
        "scale": {
            "x": -0.38,
            "y": 0.38
        },
        "animations": {
            "move": {
                "frames": Phaser.Animation.generateFrameNames('move/' , 1 , 9, '.png')
            },
            "fire": {
                "frames": Phaser.Animation.generateFrameNames('fire/' , 1 , 11, '.png')
            }
        }
    },
    "jet": {
        "image": "jet",
        "scale": {
            "x": -0.3,
            "y": 0.3
        },
        "animations": {
            "move": {
                "frames": Phaser.Animation.generateFrameNames('fly/' , 1 , 2, '.png')
            }
        }
    },
    "helicopter": {
        "image": "helicopter",
        "scale": {
            "x": -0.35,
            "y": 0.35
        },
        "animations": {
            "move": {
                "frames": Phaser.Animation.generateFrameNames('fly/' , 1 , 2, '.png')
            },
            "fall": {
                "frames": Phaser.Animation.generateFrameNames('fall/' , 1 , 16, '.png')
            }
        }
    },
    
    // Monsters
    "scrapyard robot": {
        "image": "scrapyard robot",
        "scale": {
            "x": 0.35,
            "y": 0.35
        },
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames('walk' , 1 , 23)
            }
        }
    },
    "wasp": {
        "image": "wasp",
        "scale": {
            "x": -0.3,
            "y": 0.3
        },
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames('fly' , 1 , 18)
            }
        }
    },
    "invader": {
        "image": "invader",
        "scale": {
            "x": 0.6,
            "y": 0.6
        }, 
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames('idle' , 1 , 25)
            },
            "punch": {
                "frames": Phaser.Animation.generateFrameNames('punch' , 1 , 14),
                "loop": false
            },
            "hit": {
                "frames": Phaser.Animation.generateFrameNames('hit' , 1 , 14),
                "loop": false
            }
        }
    },
    "exterminator": {
        "image": "exterminator",
        "scale": {
            "x": 0.3,
            "y": 0.3
        },
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames('idle' , 1 , 26)
            }
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
    "tank missile": {
        "image": "tank missile",
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
        },
        "anchor": {
            "x": 0,
            "y": 0
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
        },
        "anchor": {
            "x": 0,
            "y": 0
        }
    },
    "splat": {
        "image": "splat",
        "animations": {
            "move": Phaser.Animation.generateFrameNames(1 , 11)
        },
        "scale": {
            "x": 0.3,
            "y": 0.3
        },
        "offset": {
            "y": 130
        },
        "anchor": {
            "x": 0,
            "y": 0
        }
    },
    
    // Monster spawner
    "spawner": {
        "image": "spawner",
        "scale": {
            "x": 0.4,
            "y": 0.4
        },
        "offset": {
            "x": -30,
            "y": -5
        },
        "anchor": {
            "x": 1,
            "y": 1
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