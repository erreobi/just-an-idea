export class Obstacle {
    constructor(game) {
        this.game = game;
        this.collisionX = game.width * Math.random();
        this.collisionY = game.height * Math.random();
        this.collisionRadius = 70;

        this.speedFactor = 10;

    }

    draw(context) {

        //Disegna il cerchio
        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.save();
        context.globalAlpha = 0.5;
        context.fill();
        context.restore();
        context.stroke();

    }

    update() {
       
    }
}




