import { checkCollition } from './utils.js'


export class Player {
    constructor(game) {
        this.game = game;
        this.collisionX = game.width * 0.5;
        this.collisionY = game.height * 0.5;
        this.collisionRadius = 40;

        this.speedFactor = 10;

        this.img = new Image();
        this.img.src = "style/images/bull.png";

        this.spriteHeight = 255;
        this.spriteWidth = 255;
        this.scale = 1;
        this.width = this.spriteWidth*this.scale;
        this.height = this.spriteHeight*this.scale;

        this.spriteFrameX = 0;
        this.spriteFrameY = 4;

        this.bounchTime = 0;
        this.bounchInterval = 1;


    }

    restart(){
        this.collisionX = this.game.width * 0.5;
        this.collisionY = this.game.height * 0.5;
        this.spriteFrameX = 0;
        this.spriteFrameY = 4
        this.spriteX = this.collisionX - this.spriteWidth * 0.5;
        this.spriteY = this.collisionY - this.spriteHeight * 0.5 - this.collisionRadius-40;
        
    }

    draw(context) {
        // console.log(this.spriteFrameX, this.spriteFrameY);

         //console.log(dX, dY, this.speedFactor,(dX < this.speedFactor),(dY < this.speedFactor));
        //Posisiton of the sprite respectful to the collision areas
        this.spriteX = this.collisionX - this.spriteWidth * 0.5;
        this.spriteY = this.collisionY - this.spriteHeight * 0.5 - this.collisionRadius-40;

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

    }

    update(context, deltaTime) {

        let dX = this.game.mouse.x - this.collisionX;
        let dY = this.game.mouse.y - this.collisionY; 
        const distance = Math.hypot(dX, dY);
    
        if (distance < this.speedFactor){
            this.collisionX = this.game.mouse.x;
            dX = 0;
            this.collisionY = this.game.mouse.y;
            dY = 0;
        }

        //Sprites
        const angle = Math.atan2(dY,dX);
        // console.log(angle);
        if (angle < - 1.17) {this.spriteFrameY = 0; }
        else if (angle < - 0.39 ){this.spriteFrameY = 1; }
        else if (angle < 0.39 ){this.spriteFrameY = 2; }
        else if (angle < 1.17 ){this.spriteFrameY = 3; }
        else if (angle < 1.95 ){this.spriteFrameY = 4; }
        else if (angle < 2.73 ){this.spriteFrameY = 5; }
        else if (angle < 2.73 || angle > 2.74 ){this.spriteFrameY = 6; }
        else if (angle < - 1.96 ){this.spriteFrameY = 7; }

        // Speed check
        if (dX != 0 && dY != 0) {

            const speedX = dX / distance || 0;
            const speedY = dY / distance || 0;

            this.collisionX += speedX * this.speedFactor;
            this.collisionY += speedY * this.speedFactor;
        }

        //check if the prites is on the broder
        if (this.collisionX < this.collisionRadius) { 
            this.collisionX = this.collisionRadius;
        }
        else if (this.collisionX > (this.game.width - this.collisionRadius)) {
            this.collisionX = this.game.width - this.collisionRadius;
        }
        if (this.collisionY <  this.game.topMargin+this.collisionRadius) { 
            this.collisionY = this.game.topMargin+this.collisionRadius;
        }
        else if (this.collisionY > (this.game.height - (this.collisionRadius/2))) {
            this.collisionY = this.game.height - (this.collisionRadius/2);
            // console.log("height: "+this.game.height, "collisionRadius: "+this.collisionRadius);
        }
        // console.log("x: "+this.collisionX, "y: "+this.collisionY);

        //Check collisions
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

        if (this.bounchTime > this.bounchInterval)
        {
            this.spriteFrameX = (this.spriteFrameX + 3) % 59;
            this.bounchTime = 0;
        }else{
            this.bounchTime += deltaTime;
        }
        
    }
}




