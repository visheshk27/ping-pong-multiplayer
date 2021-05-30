/**
 * @class
 * @description Run Ping-Pong game
 * @example
 * const game = new PingPong('canvas', '2d');
 * game.renderer();
 */
export default class PingPong {
	/**
	 * @constructor
	 * @description Generate starter settings for further work
	 * @param {String} id - canvas's id
	 * @param {String} ctx - webgl or 2d
	 */
	constructor (id, ctx) {
		this.canvas = document.getElementById(id);
		this.ctx = this.canvas.getContext(ctx);
		this.generateObjs();
		this.canvas.addEventListener('mousemove', this.moveRacket.bind(this));
	}

	/**
	 * @method
	 * @description Generate objects, like as user's and computer's rackets, also tennis ball
	 */
	generateObjs () {
		// User's racket
		this.user = {
			x      : 0,
			y      : this.canvas.height / 2 - 200 / 2,
			width  : 20,
			height : 200,
			color  : 'white',
			score  : 0,
		};
		// Computer's racket
		this.comp = {
			x      : this.canvas.width - 20,
			y      : this.canvas.height / 2 - 200 / 2,
			width  : 20,
			height : 200,
			color  : 'white',
			score  : 0,
		};
		this.ball = {
			x         : this.canvas.width / 2,
			y         : this.canvas.height / 2,
			r         : 15,
			speed     : 5,
			velocityX : 5,
			velocityY : 5,
			color     : 'white',
		};
	}

	/**
	 * @method
	 * @description Draws a rectangular object based on the values passed to the method
	 * @param {Number} x - abscissa
	 * @param {Number} y - ordinate
	 * @param {Number} width - object's width
	 * @param {Number} height - object's height
	 * @param {String} color - object's fill color
	 */
	drawRect (x, y, width, height, color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(x, y, width, height);
	}

	/**
	 * @method
	 * @description Draws a tennis ball based on the values passed to the method
	 * @param {Number} x - abscissa
	 * @param {Number} y - ordinate
	 * @param {Number} r - radius
	 * @param {String} color - ball's fill color
	 */
	drawCircle (x, y, r, color) {
		this.ctx.fillStyle = color;
		this.ctx.beginPath();
		this.ctx.arc(x, y, r, 0, 2 * Math.PI, false);
		this.ctx.fill();
	}

	/**
	 * @method
	 * @description Draws a necessary text based on the values passed to the method
	 * @param {Number} x - abscissa
	 * @param {Number} y - ordinate
	 * @param {String} text - text for visualisation
	 * @param {String} color - text's fill color
	 */
	drawText (x, y, text, color) {
		this.ctx.fillStyle = color;
		this.ctx.font = '45px Century Gothic';
		this.ctx.fillText(text, x, y);
	}

	/**
	 * @method
	 * @description Draw tennis's net
	 * @param {Number} lineWidth - dotted line's width
	 * @param {Number} space - distance between dashed lines
	 * @param {String} color - net's color
	 */
	drawNet (lineWidth, space, color) {
		this.ctx.strokeStyle = color;
		this.ctx.lineWidth = 3;
		this.ctx.beginPath();
		this.ctx.setLineDash([ lineWidth, space ]);
		this.ctx.moveTo(this.canvas.width / 2, 0);
		this.ctx.lineTo(this.canvas.width / 2, this.canvas.height);
		this.ctx.stroke();
	}

	/**
	 * @method
	 * @description Changed racket's position
	 * @param {Object} event - event object
	 */
	moveRacket (event) {
		const rect = this.canvas.getBoundingClientRect();
		this.user.y = event.clientY - rect.top - this.user.height / 2;
	}

	/**
	 * @method
	 * @description collision between the ball and the player’s racket
	 * @param {Object} ball - ball object
	 * @param {Object} player - comp or user object
	 * @return {Boolean} - whether the ball collided with a racket
	 */
	collision (ball, player) {
		ball.top = ball.y - ball.r;
		ball.bottom = ball.y + ball.r;
		ball.right = ball.x + ball.r;
		ball.left = ball.x - ball.r;

		player.top = player.y;
		player.bottom = player.y + player.height;
		player.right = player.x + player.width;
		player.left = player.x;

		return ball.right > player.left &&
			ball.bottom > player.top &&
			ball.left < player.right &&
			ball.top < player.bottom;
	}

	/**
	 * @method
	 * @description Update round. Run, when user's or computer's score is increased
	 */
	reset () {
		this.ball.x = this.canvas.width / 2;
		this.ball.y = this.canvas.height / 2;

		this.ball.speed = 5;
		this.ball.velocityX = -this.ball.velocityX;
	}

	/**
	 * @method
	 * @description Render method
	 */
	renderer () {
		this.update();
		this.drawRect(0, 0, this.canvas.width, this.canvas.height, 'black');
		this.drawNet(25, 10, 'white');
		this.drawText(this.canvas.width / 4, this.canvas.height / 5, this.user.score, 'white');
		this.drawText(3 * this.canvas.width / 4, this.canvas.height / 5, this.comp.score, 'white');
		this.drawCircle(this.ball.x, this.ball.y, this.ball.r, 'white');
		this.drawRect(this.user.x, this.user.y, this.user.width, this.user.height, 'white');
		this.drawRect(this.comp.x, this.comp.y, this.comp.width, this.comp.height, 'white');
		requestAnimationFrame(this.renderer.bind(this));
	}

	/**
	 * @method
	 * @description Update values
	 */
	update () {
		this.ball.x += this.ball.velocityX;
		this.ball.y += this.ball.velocityY;
		// Ai for computer's racket
		const compLVL = 0.1;
		this.comp.y += (this.ball.y - (this.comp.y + this.comp.height / 2)) * compLVL;

		// Kick the ball against the top or bottom wall
		if (this.ball.y + this.ball.r > this.canvas.height || this.ball.y - this.ball.r < 0) {
			this.ball.velocityY = -this.ball.velocityY;
		}
		const player = this.ball.x < this.canvas.width / 2 ? this.user : this.comp;
		if (this.collision(this.ball, player)) {
			// Ball hit the player's racket
			let collidePoint = this.ball.y - (player.y + player.height / 2);

			// Normalization
			collidePoint /= player.height / 2;

			// Calc angle in radian
			const angleRadian = collidePoint * Math.PI / 4;

			// X direction of the ball when it's hit
			const direction = this.ball.x < this.canvas.width / 2 ? 1 : -1;
			// Change ball's velocity
			this.ball.velocityX = direction * this.ball.speed * Math.cos(angleRadian);
			this.ball.velocityY = this.ball.speed * Math.sin(angleRadian);

			// When the ball hits the racket, than increase ball's speed
			this.ball.speed += 0.6;
		}
		// Update score
		if (this.ball.x - this.ball.r < 0) {
			this.comp.score++;
			this.reset();
		} else if (this.ball.x + this.ball.r > this.canvas.width) {
			this.user.score++;
			this.reset();
		}
	}
}
