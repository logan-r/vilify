window.data = window.data || {}; // Make sure window.data is defined

var TOWER_ANGULAR_VELOCITY = 0.12;

window.data.model_data = {
	// Heroes
	"soldier": {
		"velocity": 100,
		"flying": false
	},
	"tank": {
		"velocity": 50,
		"flying": false
	},
	"jet": {
		"velocity": 300,
		"flying": {
			"min": 240,
			"max": 420
		}
	},
	"helicopter": {
		"velocity": 130,
		"flying": {
			"min": 240,
			"max": 420
		}
	},
	
	// Monsters
	"werewolf": {
		"velocity": 300,
		"flying": false
	},
	
	// Towers
	"destroyed tower": {
		"velocity": 0
	},
	"bullet tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"abilities": [
			{
				"type": "projectile",
				"projectile": "missile",
				"cooldownLength": 100,
				"cooldown": 100
			}
		]
	},
	"slime tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"abilities": [
			{
				"type": "projectile",
				"projectile": "slime",
				"cooldownLength": 100,
				"cooldown": 100
			}
		]
	},
	"energy tower": {
		"velocity": TOWER_ANGULAR_VELOCITY
	},
	"missile tower": {
		"velocity": TOWER_ANGULAR_VELOCITY
	},
	"tornado tower": {
		"velocity": TOWER_ANGULAR_VELOCITY
	},
	"curse tower": {
		"velocity": TOWER_ANGULAR_VELOCITY
	},
	"tesla tower": {
		"velocity": TOWER_ANGULAR_VELOCITY
	},
	"radiation tower": {
		"velocity": TOWER_ANGULAR_VELOCITY
	},
	"wormhole tower": {
		"velocity": TOWER_ANGULAR_VELOCITY
	},
	
	// Projectiles
	"missile": {
		"effect": "explosion"
	},
	"slime": {
		"effect": "splat"
	},
	
	// Items
    "alien item": {
        "velocity": 600
    },
    "biochem item": {
        "velocity": 600
    },
    "tech item": {
        "velocity": 600
    }
};