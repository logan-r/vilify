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
				"damage": 1 // Damage per second
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
				"damage": 4 // Damage per second
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
				"damage": 100 // Damage per second
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
				"damage": 1 // Damage per second
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
				"damage": 1 // Damage per second
			}
		],
		"flavor": "A soldier from a alien empire sent to earth to take all our applesauce.",
		"description": "Good health. Low damage."
	},
	"sentinel": {
		"health": 80,
		"flying": false,
		"reach": [20, 40],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "groundslam",
				"damage": 1 // Damage per second
			}
		]
	},
	"zombie bunny": {
		"health": 80,
		"flying": false,
		"reach": [20, 40],
		"flavor": "It's a zombie! ...a zombie bunny!",
		"description": "Has lots of health, but isn't itellegent enough to do anything but hop."
	},
	"exterminator": {
		"health": 20,
		"flying": false,
		"reach": [20, 40],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "attack",
				"damage": 1 // Damage per second
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
		"description": "Needs a description.",
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "groundslam",
				"damage": 1 // Damage per second
			}
		]
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
		"reach": [-10, 10],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "punch",
				"damage": 1 // Damage per second
			},
			{
				"type": "melee_attack",
				"animation": "punchB",
				"damage": 1 // Damage per second
			},
			{
				"type": "melee_attack",
				"animation": "jab",
				"damage": 1 // Damage per second
			},
			{
				"type": "melee_attack",
				"animation": "uppercut",
				"damage": 1 // Damage per second
			}
		],
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
	"lightning tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "electric bolt",
				"cooldownLength": 80,
				"cooldown": 80
			}
		],
		"flavor": "needs falvor text",
		"description": "Fires at a slightly faster rate than a ballistic tower, but does slightly less damage."
	},
	"sludge tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "slime blob",
				"cooldownLength": 100,
				"cooldown": 100
			}
		]
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
		"abilities": [
			{
				"type": "projectile",
				"projectile": "tornado bolt",
				"cooldownLength": 100,
				"cooldown": 100
			}
		],
		"flavor": "Needs falvor text.",
		"description": "Needs a description."
	},
	"curse tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "curse bolt",
				"cooldownLength": 100,
				"cooldown": 100
			}
		],
		"flavor": "Needs falvor text.",
		"description": "Needs a description."
	},
	"missile tower": {
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
	"tesla tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "electric bolt",
				"cooldownLength": 10,
				"cooldown": 10
			}
		],
		"flavor": "needs falvor text",
		"description": "needs a description"
	},
	"rift tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "rift bolt",
				"cooldownLength": 100,
				"cooldown": 100
			}
		],
		"flavor": "Opens a rift in the spacetime continuum.",
		"description": "Sends heroes back to the entrance of the lab."
	},
	
	// Projectiles
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
	"missile": {
		"effect": "explosion",
		"projectileType": "bomb",
		"damage": 100
	},
	"electric bolt": {
		"effect": "spark",
		"projectileType": "bomb",
		"damage": 1,
		"noGravity": true // Not effected by gravity
	},
	"tornado bolt": {
		"effect": "tornado",
		"projectileType": "bomb",
		"damage": 20,
		"noGravity": true // Not effected by gravity
	},
	"slime blob": {
		"effect": "slime smoke",
		"projectileType": "bomb",
		"damage": 0,
		"status": "slime"
	},
	"curse bolt": {
		"effect": "curse smoke",
		"projectileType": "bomb",
		"damage": 0,
		"noGravity": true, // Not effected by gravity
		"status": "curse"
	},
	"rift bolt": {
		"effect": "rift",
		"projectileType": "bomb",
		"damage": 0,
		"noGravity": true, // Not effected by gravity
		"status": "rift"
	},
	"laser": {
		"projectileType": "bullet",
		"damage": 100
	},
	"tank missile": {
		"effect": "fireball",
		"projectileType": "bomb",
		"damage": 1
	}
};