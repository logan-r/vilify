window.data = window.data || {}; // Make sure window.data is defined

window.data.model_data = {
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
	"scrapyard robot": {
		"velocity": 100,
		"flying": false
	},
	"werewolf": {
		"velocity": 300,
		"flying": false
	},
	"turret": {
		"velocity": 0.01
	}
};