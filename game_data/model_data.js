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
		"health": 1000,
		"flying": false,
		"reach": [20, 60],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "attack",
				"damage": 1 // Damage per frame
			}
		],
		"flavor": "Needs a flavor.",
		"description": "Needs a description."
	},
	"wasp": {
		"health": 40,
		"flying": {
			"min": 240,
			"max": 420
		},
		"reach": [20, 60],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "blade",
				"damage": 1 // Damage per frame
			}
		],
		"flavor": "A bee with an itch for destruction.",
		"description": "Not very powerful in combat, but it can fly."
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
	"sentinel": {
		"health": 80,
		"flying": false,
		"reach": [20, 40],
		"abilities": []
	},
	"zombie bunny": {
		"health": 80,
		"flying": false,
		"reach": [20, 40],
		"abilities": [],
		"flavor": "It's a zombie! It's also a bunny.",
		"description": "Needs a description."
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
	"talos": {
		"health": 80,
		"flying": false,
		"reach": [20, 40],
		"abilities": [],
		"flavor": "Needs flavor text.",
		"description": "Needs a description."
	},
	"werewolf": {
		"health": 80,
		"flying": false,
		"reach": [20, 40],
		"abilities": [],
		"flavor": "It's on team Jacob.",
		"description": "Needs a description."
	},
	"overlord": {
		"health": 80,
		"flying": false,
		"reach": [20, 40],
		"abilities": [],
		"flavor": "Needs flavor text.",
		"description": "Needs a description."
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
	"ballistic tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "ballistic missile",
				"cooldownLength": 100,
				"cooldown": 100
			}
		],
		"flavor": "needs falvor text",
		"description": "needs a description"
	},
	"tesla tower": {
	},
	"wormhole tower": {
	},
	
	// Projectiles
	"missile": {
		"effect": "explosion",
		"projectileType": "bomb",
		"damage": 100
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
	"ballistic missile": {
		"effect": "impact",
		"projectileType": "bomb",
		"damage": 1
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