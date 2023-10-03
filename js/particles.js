export class Particle {

    constructor(game, x, y, color){
        this.game = game;
        this.collisionX = x;
        this.collisionY = y;
        this.collisionRadius = Math.random()*10+1;
        this.color = color;
        this.speedY = Math.random()*10+1;
        this.speedX = Math.random()*10+1;
        this.angle = 0;
        this.angleVa = 0.08;
        this.markForRemoval = false;
    }

    draw (context){
        context.save();

        context.fillStyle =  this.color;
        context.strokeStyle = 'black';
        context.globalAlpha = 1;

        context.beginPath();
        context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
        context.fill();
        context.stroke();
        context.restore();
    }

}

export class FireParticle extends Particle {

    update (context)
    {
        // console.log("FireParticle", this.collisionX, this.collisionY );
        this.collisionY -= this.speedY;
        this.collisionX += this.speedX*Math.cos(this.angle);
        this.angle += this.angleVa;

        if (this.collisionY < this.collisionRadius){
            this.markForRemoval = true;
            this.game.removeObjects();
        }
    }

}

export class SparkParticle extends Particle {

    update (context)
    {
        // console.log("FireParticle", this.collisionX, this.collisionY );
        this.collisionY -= this.speedY * Math.sin(this.angle);
        this.collisionX -= this.speedX * Math.cos(this.angle);
        this.angle += this.angleVa;

        if (this.collisionRadius > 0.1)  this.collisionRadius -= 0.1;
        if (this.collisionRadius < 0.2) {
            this.markForRemoval = true;
            this.game.removeObjects();
        }
    }

}