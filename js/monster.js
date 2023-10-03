import { checkCollition } from './utils.js'


export class Monster {
    constructor(game) {
        this.game = game;
        this.collisionX = this.game.width;
        this.collisionY = this.game.topMargin+(this.game.height-this.game.topMargin)*Math.random();
        this.collisionRadius = 40;

        this.speedFactor = Math.random()*3 + 2;

        this.img = new Image();
        this.img.src = "style/images/toads.png";

        this.spriteHeight = 260;
        this.spriteWidth = 140;
        this.scale = 1;
        this.width = this.spriteWidth*this.scale;
        this.height = this.spriteHeight*this.scale;

        //Posisiton of the sprite respectful to the collision areas

        this.spriteFrameX= 0;
        this.spriteFrameY= Math.floor(Math.random() * 4);

    }

    draw(context) {

        this.spriteX = this.collisionX - this.spriteWidth * 0.5;
        this.spriteY = this.collisionY - this.spriteHeight * 0.5 - 60;

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

    update(context) {

        if (this.collisionX <= 0 && !this.game.gameOver)
        {
            //IT will restart for another random position. We could recreate them but it wouldn't be efficient. 
            this.collisionX = this.game.width;
            this.collisionY = this.game.topMargin+(this.game.height-this.game.topMargin)*Math.random();
            
            //with another skin
            this.spriteFrameY= Math.floor(Math.random() * 4);

        }
        this.collisionX -= 1 * this.speedFactor;

        
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




