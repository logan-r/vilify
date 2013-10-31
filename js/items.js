/*!
 * Vilify items.js
 */

(function(window) {
	/**
	 * Item object
	 * An item that can be used to build or upgrad towers, monsters and potions
	 */
	var Item = function(x, y) {
		this.initialize(x, y);
	}

	var p = Item.prototype = new createjs.Container();
	Item.prototype.Container_initialize = p.initialize;

	Item.prototype.initialize = function(x, y) {
		this.Container_initialize();

		// Item data

		// Item state
		// FREE: item is out of lists and needs to be added
		// LISTED: item is in list
		// DRAGGING: item is being dragged by the player
		this.state = "FREE";

		// Item position
		this.x = x;
		this.y = y;

		this.goal = ItemsList.book();
		this.Vx = 1000;
		this.Vy = (this.goal[1] - this.y) / (this.goal[0] - this.x) * 1000;

		// Item image
		var image = new createjs.Shape();
		image.graphics.beginFill("#2483ff").drawRect(0, 0, 30, 30);
		this.addChild(image);

		// Add events
		image.addEventListener("pressmove", function(event) {
			event.target.parent.state = "DRAGGED";
			event.target.parent.x = event.stageX;
			event.target.parent.y = event.stageY;
		});
		image.addEventListener("pressup", function(event) {
			event.target.parent.Vx = 1000;
			event.target.parent.Vy = (event.target.parent.goal[1] - event.target.parent.y) / (event.target.parent.goal[0] - event.target.parent.x) * 1000;
			event.target.parent.state = "FREE";
		});

		this.tick = function(event) {
			switch (this.state) {
				case "FREE":
					this.x += event.delta/1000 * this.Vx;
					this.y += event.delta/1000 * this.Vy;
					if (this.x > this.goal[0]) {
						this.x = this.goal[0];
						this.y = this.goal[1];
						this.inList = "LISTED";
						//ItemsList.reachedPosition(this);
					}
					break;
			}
		}
	}

	window.Item = Item;
	window.ITEMS = ITEMS = []; // List of all active items

	ItemsList = {
		items: [],
		openPositions: [90, 130, 170, 210, 250, 290, 330, 370, 410],
		book: function() {
			if (this.openPositions.length > 0) {
				y = this.openPositions[0];
				this.openPositions.splice(0, 1);
				return [900, y];
			}
			return [900, 450];
		}
	}
	window.ItemsList = ItemsList; // For debug only; To be removed
})(window);
