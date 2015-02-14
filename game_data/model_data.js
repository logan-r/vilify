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
		}
	},
	"invader": {
		"health": 90,
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
		"description": "Good health. Low damage."
	},
	"exterminator": {
		"health": 20,
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
	
    // Monster spawner
    "spawner": {
		"flavor": "Needs flavor text.",
		"description": "You can spawn a monster here."
    },
	
	// Towers
	"destroyed tower": {
		"flavor": "The reminants of some previous mechanism.",
		"description": "You can build a tower here."
	},
	"missle tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "missile",
				"cooldownLength": 100,
				"cooldown": 100
			}
		],
		"flavor": "The most generic tower there is.",
		"description": "Average damage, average attack speed, average everything."
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
	"bomb tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "fire missile",
				"cooldownLength": 100,
				"cooldown": 100
			}
		],
		"flavor": "Needs falvor text.",
		"description": "Needs a description."
	},
	"tornado tower": {
	},
	"curse tower": {
	},
	"nuclear tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "fire missile",
				"cooldownLength": 100,
				"cooldown": 100
			}
		],
		"flavor": "needs falvor text.",
		"description": "needs a description."
	},
	"tesla tower": {
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
	}
};