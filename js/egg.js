import { checkCollition } from './utils.js'

export class Egg {
    constructor(game) {
        this.game = game;

        this.collisionRadius = 40;
        this.margin = this.collisionRadius * 2;

        this.collisionX = this.margin + ((game.width - this.margin*2)* Math.random());
        this.collisionY = this.game.topMargin + ((game.height - this.game.topMargin - this.margin)* Math.random());
        

        this.img = new Image();
        this.img.src = "style/images/egg.png";

        //Size of a sprite
        this.spriteHeight = 135;
        this.spriteWidth = 110;
        this.scale = 1;
        this.width = this.spriteWidth*this.scale;
        this.height = this.spriteHeight*this.scale;
    }

    draw(context) {
        this.spriteX = this.collisionX - this.spriteWidth * 0.5;
        this.spriteY = this.collisionY - this.spriteHeight * 0.5 - this.collisionRadius;

        context.drawImage(this.img, 
            this.spriteX, 
            this.spriteY,    
            this.spriteWidth, 
            this.spriteHeight);
        
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

    update() {
       
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


    }
}




