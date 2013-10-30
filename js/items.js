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
		this.inList = false;

		// Item position
		this.x = x;
		this.y = y;

		this.goal = ItemsList.bookNextPosition();
		this.Vx = 300;
		this.Vy = (this.goal[1] - this.y) / (this.goal[0] - this.x) * 300;

		// Item image
		var image = new createjs.Shape();
		image.graphics.beginFill("#2483ff").drawRect(0, 0, 30, 30);
		this.addChild(image);

		this.tick = function(event) {
			if (!this.inList) {
				this.x += event.delta/1000 * this.Vx;
				this.y += event.delta/1000 * this.Vy;
			}
			if (this.x > this.goal[0]) {
				this.x = this.goal[0];
				this.y = this.goal[1];
				this.inList = true;
				ItemsList.reachedPosition(this);
			}
		}
	}

	window.Item = Item;
	window.ITEMS = ITEMS = []; // List of all active items

	ItemsList = {
		startx: 900,
		nexty: 95,
		starty: 95,
		spacing: 40,
		items: 0,
		bookNextPosition: function() {
			if (this.items < 9) {
				this.items++;
				nextPosition = [this.startx, this.nexty];
				this.nexty += this.spacing;
				return nextPosition;
			}
			else return [900, this.starty + this.spacing * 9]; // temporary
		},
		reachedPosition: function(item) {
			if (item.goal[1] == this.starty + this.spacing * 9) {
				Game.stage.removeChild(item);

				// Create extra list icon
				var image = new createjs.Shape();
				image.graphics.beginFill("#96C4ff").drawRect(this.startx, this.starty + this.spacing * 9, 30, 30);
				Game.stage.addChild(image);
			}
		}
	}
})(window);
