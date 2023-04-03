import { checkCollition } from './utils.js'


export class Player {
    constructor(game) {
        this.game = game;
        this.collisionX = game.width * 0.5;
        this.collisionY = game.height * 0.5;
        this.collisionRadius = 50;

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

        // Disegna la linea per la direzione
        if (this.game.mouse.pressed) {
            context.save();
            context.lineWitdh = 10;
            context.strokeStyle = 'red';
        }
        context.beginPath();
        context.moveTo(this.collisionX, this.collisionY);
        context.lineTo(this.game.mouse.x, this.game.mouse.y);
        context.stroke();
        if (this.game.mouse.pressed) {
            context.restore();
        }

    }

    update() {
        let dX = this.game.mouse.x - this.collisionX;
        let dY = this.game.mouse.y - this.collisionY; 
        const distance = Math.hypot(dX, dY);
    
        if (distance < this.speedFactor){
            this.collisionX = this.game.mouse.x;
            dX = 0;
            this.collisionY = this.game.mouse.y;
            dY = 0;
        }

        //console.log(dX, dY, this.speedFactor,(dX < this.speedFactor),(dY < this.speedFactor));

        if (dX != 0 && dY != 0) {

            const speedX = dX / distance || 0;
            const speedY = dY / distance || 0;

            this.collisionX += speedX * this.speedFactor;
            this.collisionY += speedY * this.speedFactor;
        }

        this.game.obastacles.forEach(obstacle => {
            let [collision, distance, sumofRadii, dx, dy] = checkCollition(this, obstacle);
            if (collision)
            {
                let directionX = dx/distance;
                let directionY = dy/distance;   
                this.collisionX = obstacle.collisionX + (sumofRadii+1) * directionX;
                this.collisionY = obstacle.collisionY + (sumofRadii+1) * directionY;
            }
        });


    }
}




