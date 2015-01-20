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
		"velocity": 200,
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
		"velocity": 0,
		"attacks": false
	},
	"bullet tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"attacks": true
	},
	"slime tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"attacks": true
	},
	"energy tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"attacks": true
	},
	"missile tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"attacks": true
	},
	"tornado tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"attacks": true
	},
	"curse tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"attacks": true
	},
	"tesla tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"attacks": true
	},
	"radiation tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"attacks": true
	},
	"wormhole tower": {
		"velocity": TOWER_ANGULAR_VELOCITY,
		"attacks": true
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