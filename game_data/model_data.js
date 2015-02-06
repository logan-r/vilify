window.data = window.data || {}; // Make sure window.data is defined

window.data.model_data = {
	// Heroes
	"soldier": {
		"velocity": 100,
		"flying": false,
		"health": 100
	},
	"tank": {
		"velocity": 50,
		"flying": false,
		"health": 5,
		"reach": 35,
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "fire",
				"damage": 1 // Damage per frame
			},
			{
				"type": "range_attack",
				"animation": "fire",
				"projectile": "tank missile",
				"angle": -Math.PI / 2,
				"offsetY": 45,
				"cooldownLength": 100,
				"cooldown": 100
			}
		]
	},
	"ninja": {
		"velocity": 100,
		"flying": false,
		"health": 100,
		"reach": 35,
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "attack",
				"damage": 1 // Damage per frame
			}
		]
	},
	"jet": {
		"velocity": 300,
		"flying": {
			"min": 240,
			"max": 420
		},
		"health": 1
	},
	"helicopter": {
		"velocity": 130,
		"flying": {
			"min": 240,
			"max": 420
		},
		"health": 2
	},
	
	// Monsters
	"scrapyard robot": {
		"health": 1,
		"flying": false
	},
	"wasp": {
		"health": 1,
		"flying": {
			"min": 240,
			"max": 420
		},
	},
	"invader": {
		"health": 400,
		"flying": false,
		"reach": [20, 60],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "punch",
				"damage": 1 // Damage per frame
			}
		],
		"flavor": "A soldier from a alien empire sent to earth to take all our applesauce.",
		"description": "Level 1. Doesn't deal a massive amount of damage."
	},
	"exterminator": {
		"health": 1,
		"flying": false,
		"reach": [20, 40],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "attack",
				"damage": 1 // Damage per frame
			},
			{
				"type": "range_attack",
				"animation": "fire",
				"projectile": "laser",
				"angle": Math.PI / 2,
				"offsetY": 70,
				"cooldownLength": 100,
				"cooldown": 100
			}
		]
	},
	
	// Towers
	"destroyed tower": {
		"velocity": 0
	},
	"bullet tower": {
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
	},
	"missile tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "fire missile",
				"cooldownLength": 100,
				"cooldown": 100
			}
		]
	},
	"tornado tower": {
	},
	"curse tower": {
	},
	"tesla tower": {
	},
	"radiation tower": {
	},
	"wormhole tower": {
	},
	
	// Projectiles
	"missile": {
		"effect": "explosion",
		"projectileType": "bomb",
		"damage": 1
	},
	"laser": {
		"projectileType": "bullet",
		"damage": 100
	},
	"fire missile": {
		"effect": "fireball",
		"projectileType": "bomb",
		"damage": 4
	},
	"tank missile": {
		"effect": "fireball",
		"projectileType": "bomb",
		"damage": 1
	},
	"slime": {
		"effect": "splat",
		"projectileType": "bullet",
		"damage": 0,
		"status": "slime"
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