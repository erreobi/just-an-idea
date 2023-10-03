import { checkCollition } from './utils.js'
import { FireParticle, SparkParticle } from './particles.js'

export class Larva {
    constructor(game, x, y) {
        this.game = game;

        this.collisionRadius = 40;

        this.collisionX = x;
        this.collisionY = y;
        
        this.img = new Image();
        this.img.src = "style/images/larva.png";

        //Size of a sprite
        this.spriteHeight = 150;
        this.spriteWidth = 150;
        this.scale = 1;
        this.width = this.spriteWidth*this.scale;
        this.height = this.spriteHeight*this.scale;

        this.speed = 5;
        this.spriteFrameX= 0;
        this.spriteFrameY= Math.floor(Math.random() * 2);
        
        this.markForRemoval = false;

    }

    draw(context) {

        this.spriteX = this.collisionX - this.spriteWidth * 0.5;
        this.spriteY = this.collisionY - this.spriteHeight * 0.5 - this.collisionRadius;

        context.drawImage(this.img,
            this.spriteFrameX * this.spriteWidth, 
            this.spriteFrameY * this.spriteHeight,
            this.spriteWidth, 
            this.spriteHeight,
            this.spriteX, 
            this.spriteY,
            this.width, 
            this.height);
        
        if (this.game.debug)
        {
            //Disegna il cerchio
            context.beginPath();
            context.arc(this.collisionX, this.collisionY, this.collisionRadius, 0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
        }

    }

    update(context, deltaTime) {

        this.collisionY -= this.speed;

        // console.log("Y",this.collisionY,"TOP",this.game.topMargin);

        if (this.collisionY < (this.game.topMargin-this.collisionRadius*0.5))
        {
            this.markForRemoval = true;
            this.game.removeObjects();
           
            if (!this.game.gameover)
                this.game.increaseScore();

            for (let counter = 0; counter < 15; counter++)
            {
                this.game.addParticle(new FireParticle(this.game, this.collisionX, this.collisionY, "Yellow"));
            }
        }
       
        // collision
        let gameObjects = [this.game.player, ...this.game.obastacles];
        gameObjects.forEach(object => {

            let [collision, distance, sumofRadii, dx, dy] = checkCollition(this, object);
            if (collision)
            {
                let directionX = dx/distance;
                let directionY = dy/distance;   
                this.collisionX = object.collisionX + (sumofRadii+1) * directionX;
                this.collisionY = object.collisionY + (sumofRadii+1) * directionY;
            }

        });

        // collision with Monster
        gameObjects = [...this.game.monsters];
        gameObjects.forEach(object => {

            if (checkCollition(this, object)[0])
            {
                this.markForRemoval = true;
                this.game.removeObjects();
                
                if (!this.game.gameover)
                    this.game.increaseHatchingKilled();

                for (let counter = 0; counter < 10; counter++)
                {
                    this.game.addParticle(new SparkParticle(this.game, this.collisionX, this.collisionY, "Red"));
                }
            }

        });

    }
}




