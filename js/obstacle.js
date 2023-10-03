export class Obstacle {
    constructor(game) {
        this.game = game;
        this.collisionX = game.width * Math.random();
        this.collisionY = game.height * Math.random();
        this.collisionRadius = 50;

        this.speedFactor = 10;

        this.img = new Image();
        this.img.src = "style/images/obstacles.png";

        //Size of a sprite
        this.spriteHeight = 250;
        this.spriteWidth = 250;
        this.scale = 1;
        this.width = this.spriteWidth*this.scale;
        this.height = this.spriteHeight*this.scale;

        //Posisiton of the sprite respectful to the collision areas
        this.spriteX = this.collisionX - this.spriteWidth * 0.5;
        this.spriteY = this.collisionY - this.spriteHeight * 0.5 - this.collisionRadius-10;

        this.spriteFrameX= Math.floor(Math.random() * 4);
        this.spriteFrameY= Math.floor(Math.random() * 3);
        
    }

    draw(context) {

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

    update() {
       
    }
}




