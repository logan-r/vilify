window.data = window.data || {}; // Make sure window.data is defined

// Rate-Of-Fire speeds for towers
var ROF_EXTREMELY_FAST = 150;
var ROF_FAST = 750;
var ROF_AVERAGE = 1000;
var ROF_SLOW = 1250;
var ROF_EXTREMELY_SLOW = 1850;

window.data.model_data = {
	// Heroes
	"soldier": {
		"velocity": 100,
		"flying": false,
		"health": 3,
		"reach": 35,
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "fire",
				"damage": 1
			}
		]
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
			}
		]
	},
	"ninja": {
		"velocity": 100,
		"flying": false,
		"health": 3,
		"reach": 35,
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "attack",
				"damage": 3 // Damage per second
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
		"health": 12,
		"flying": false,
		"reach": [20, 60],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "attack",
				"damage": 3 // Damage per second
			}
		],
		"flavor": "Needs a flavor.",
		"description": "Needs a description."
	},
	"wasp": {
		"health": 1,
		"flying": {
			"min": 240,
			"max": 420
		},
		"reach": [20, 60],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "blade",
				"damage": 2 // Damage per second
			}
		],
		"flavor": "A bee with an itch for destruction.",
		"description": "Not very powerful in combat, but it can fly."
	},
	"invader": {
		"health": 15,
		"flying": false,
		"reach": [20, 60],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "punch",
				"damage": 2.75 // Damage per second
			}
		],
		"flavor": "A soldier from a alien empire sent to earth to take all our applesauce.",
		"description": "Good health. Low damage."
	},
	"sentinel": {
		"health": 18,
		"flying": false,
		"reach": [20, 40],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "groundslam",
				"damage": 5 // Damage per second
			},
			{
				"type": "melee_attack",
				"animation": "uppercut",
				"damage": 4, // Damage per second
				"status": "knockback"
			}
		]
	},
	"zombie bunny": {
		"health": 30,
		"flying": false,
		"reach": [20, 40],
		"flavor": "It's a zombie! ...a zombie bunny!",
		"description": "Has lots of health, but isn't itellegent enough to do anything but hop."
	},
	"exterminator": {
		"health": 10,
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
				"cooldown": 1200
			}
		]
	},
	"talos": {
		"health": 24,
		"flying": false,
		"reach": [20, 40],
		"abilities": [],
		"flavor": "Needs flavor text.",
		"description": "Needs a description.",
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "groundslam",
				"damage": 8 // Damage per second
			},
			{
				"type": "melee_attack",
				"animation": "spin",
				"damage": 8 // Damage per second
			}
		]
	},
	"werewolf": {
		"health": 15,
		"flying": false,
		"reach": [20, 40],
		"abilities": [],
		"flavor": "It's on team Jacob.",
		"description": "Low health, but high damage. When in not in combat, it can howl - impowering\nnearby with the  monsters thrill of the hunt.",
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "attack",
				"damage": 10 // Damage per second
			},
			{
				"type": "enhancer",
				"animation": "howl",
				"targets": [-1, 1],
				"status": "rage"
			}
		]
	},
	"overlord": {
		"health": 20,
		"flying": false,
		"reach": [-10, 10],
		"abilities": [
			{
				"type": "melee_attack",
				"animation": "punch",
				"damage": 6 // Damage per second
			},
			{
				"type": "melee_attack",
				"animation": "punchB",
				"damage": 6 // Damage per second
			},
			{
				"type": "melee_attack",
				"animation": "jab",
				"damage": 6 // Damage per second
			}/*,
			{
				"type": "melee_attack",
				"animation": "uppercut",
				"damage": 3.2
			}*/
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
				"cooldown": ROF_AVERAGE
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
				"cooldown": ROF_FAST
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
				"cooldown": ROF_SLOW
			}
		]
	},
	"bomb tower": {
		"abilities": [
			{
				"type": "projectile",
				"projectile": "fire missile",
				"cooldown": ROF_SLOW
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
				"cooldown": ROF_FAST
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
				"cooldown": ROF_SLOW
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
				"cooldown": ROF_AVERAGE
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
				"cooldown": ROF_EXTREMELY_FAST
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
				"cooldown": ROF_EXTREMELY_SLOW
			}
		],
		"flavor": "Opens a rift in the spacetime continuum.",
		"description": "Sends heroes back to the entrance of the lab."
	},
	
	// Projectiles
	"ballistic missile": {
		"effect": "impact",
		"projectileType": "bomb",
		"damage": 2
	},
	"fire missile": {
		"effect": "fireball",
		"projectileType": "bomb",
		"damage": 4
	},
	"missile": {
		"effect": "explosion",
		"projectileType": "bomb",
		"damage": 4
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
		"damage": 2,
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
		"damage": 1
	},
	"tank missile": {
		"effect": "fireball",
		"projectileType": "bomb",
		"damage": 1
	}
};