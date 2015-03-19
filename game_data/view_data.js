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
            "x": -0.36,
            "y": 0.36
        },
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames('move/' , 1 , 9, '.png')
            },
            "fire": {
                "frames": Phaser.Animation.generateFrameNames('fire/' , 1 , 11, '.png'),
                "loop": false
            }
        }
    },
    "ninja": {
        "image": "ninja",
        "scale": {
            "x": 0.38,
            "y": 0.38
        },
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames("run", 1, 10)
            },
            "attack": {
                "frames": Phaser.Animation.generateFrameNames("attack", 1, 10),
                "loop": false
            },
            "throw": {
                "frames": Phaser.Animation.generateFrameNames("throw", 1, 10),
                "loop": false
            },
            "death": {
                "frames": Phaser.Animation.generateFrameNames("death", 1, 10),
                "loop": false
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
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames("idle", 1, 35)
            },
            "attack": {
                "frames": Phaser.Animation.generateFrameNames("attack", 1, 40)
            }
        }
    },
    "wasp": {
        "image": "wasp",
        "scale": {
            "x": -1,
            "y": 1
        },
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames("fly", 1, 18)
            },
            "blade": {
                "frames": Phaser.Animation.generateFrameNames("blade", 1, 17)
            },
            "fire": {
                "frames": Phaser.Animation.generateFrameNames("fire", 1, 11)
            }
        }
    },
    "invader": {
        "image": "invader",
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames('idle', 1 , 25)
            },
            "punch": {
                "frames": Phaser.Animation.generateFrameNames('punch' , 1 , 14),
                "loop": false
            }
        }
    },
    "sentinel": { // md - 16% of original
        "image": "sentinel",
        "scale": {
            "x": -1,
            "y": 1
        },
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames("idle", 1, 59)
            },
            "groundslam": {
                "frames": Phaser.Animation.generateFrameNames("groundslam", 1, 48),
                "loop": false
            },
            "uppercut": {
                "frames": Phaser.Animation.generateFrameNames("uppercut", 1, 37),
                "loop": false
            }
        }
    },
    "zombie bunny": { // md - 28% of original
        "image": "zombie bunny",
        "scale": {
            "x": -1,
            "y": 1
        },
        "animations": {
            "idle": {
                "frames": ["hop1"]
            }
        }
    },
    "exterminator": { // md - 20% of original, sd - 15% of original
        "image": "exterminator",
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames('idle' , 1 , 26)
            },
            "attack": {
                "frames": Phaser.Animation.generateFrameNames('attack' , 1 , 12),
                "loop": false
            },
            "fire": {
                "frames": Phaser.Animation.generateFrameNames('fire' , 1 , 11),
                "loop": false
            }
        }
    },
    "talos": { // md - 35% of original
        "image": "talos",
        "scale": {
            "x": 1,
            "y": 1
        },
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames("idle", 1, 21)
            }
        }
    },
    "werewolf": { // sd - 20% of original, md - 30% of original
        "image": "werewolf",
        "scale": {
            "x": -0.75,
            "y": 0.75
        },
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames("idle", 1, 50)
            },
            "attack": {
                "frames": Phaser.Animation.generateFrameNames("attack", 1, 77),
                "loop": false
            },
            "to_howl": {
                "frames": Phaser.Animation.generateFrameNames("to_howl", 1, 18),
                "loop": false
            },
            "howl": {
                "frames": Phaser.Animation.generateFrameNames("howl", 1, 2)
            }
        }
    },
    "overlord": { // md - 28% of original
        "image": "overlord",
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames("idle", 1, 28)
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
        "visible": false,
        "tint": 0xffffff
    },
    "ballistic tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0xffffff
    },
    "sludge tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x00ff00
    },
    "lightning tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x94d6ff
    },
    "bomb tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0xbbbbbb
    },
    "tornado tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x62A3CC
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
    "missile tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x777777
    },
    "tesla tower": {
        "image": "tower turret",
        "base_frame": "1.png",
        "scale": {
            "x": TOWER_X_SCALE,
            "y": TOWER_Y_SCALE
        },
        "tint": 0x3C7D9E
        //"tint": 0x4c7a8a
    },
    "rift tower": {
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
    "ballistic missile": {
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
    "electric bolt": {
        "image": "electric",
        "scale": {
            "x": 0.4,
            "y": 0.4
        }
    },
    "curse bolt": {
        "image": "smoke",
        "scale": {
            "x": 0.7,
            "y": 0.7
        }
    },
    "laser": {
        "image": "laser",
        "scale": {
            "x": 1,
            "y": 1
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
            "idle": Phaser.Animation.generateFrameNames(1, 8)
        },
        "scale": {
            "x": 0.25,
            "y": 0.25
        }
    },
    
    // Effects
    "impact": { // md - 70% of original
        "image": "impact",
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames(1, 30),
                "loop": false
            }
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
            "idle": {
                "frames": Phaser.Animation.generateFrameNames(1, 31),
                "loop": false
            }
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
    "explosion": {
        "image": "explosion",
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames(1, 21),
                "loop": false
            }
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
    "spark": { // md - 40% of original
        "image": "spark",
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames(1, 10),
                "loop": false
            }
        },
        "scale": {
            "x": 0.7,
            "y": 0.7
        },
        "anchor": {
            "x": 0,
            "y": -0.5
        }
    },
    "splat": {
        "image": "splat",
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames(1, 11),
                "loop": false
            }
        },
        "scale": {
            "x": 0.3,
            "y": 0.3
        },
        "offset": {
            "y": 130,
            "x": 0
        },
        "anchor": {
            "x": 0,
            "y": 0
        }
    },
    "smoke": { // md - 40% of original
        "image": "smoke",
        "animations": {
            "idle": {
                "frames": Phaser.Animation.generateFrameNames(1, 27),
                "loop": false
            }
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
    }
};