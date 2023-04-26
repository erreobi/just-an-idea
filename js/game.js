import { Player } from './player.js'
import { Obstacle } from './obstacle.js'

// it will manager the game logic and dynamics
export class Game {
    constructor(canvas) {
        // Fame Ares
        this.canvas = canvas;
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.topMargin = 260;
        
        // Mouse Events
        this.mouse = {
            x: this.width * 0.5,
            y: this.height * 0.5,
            pressed: false
        }
        this.eventHandlers();

        // Games elements
        this.player = new Player(this);
        this.obastacles = [];
        this.numberOfObstacles = 20;

        this.debug = true;
        
    }

    init(){
        

        for (let index = 0, limit = 500; index < this.numberOfObstacles && limit >= 0; limit--) {
                    
            const newObstacle = new Obstacle(this);
            let founsCollisions = false;
            

            // COLLITION DETECTION
            this.obastacles.every(obstacle => {

                const dx = obstacle.collisionX - newObstacle.collisionX;
                const dy = obstacle.collisionY - newObstacle.collisionY; 
                const distance = Math.hypot(dx,dy);
                const distBufferPx = 150;
                const collisionDistance = obstacle.collisionRadius+newObstacle.collisionRadius+distBufferPx;

                if (distance < collisionDistance)
                {
                    founsCollisions = true;
                    return false
                }

                return true;
            });

            const margin = newObstacle.collisionRadius * 2;
            const testXPosition = newObstacle.spriteX > 0 && newObstacle.spriteX < (this.width - newObstacle.spriteWidth);
            const testYPosition = newObstacle.collisionY > ( this.topMargin+margin) && newObstacle.collisionY < (this.height - margin);

            if (!founsCollisions && testXPosition && testYPosition)
            {
                this.obastacles.push(newObstacle);
                index++
            }

        }

    }

    render(context) {
        
        this.obastacles.forEach(obstacle => obstacle.draw(context));
        
        this.player.draw(context);
        this.player.update();

    }

    eventHandlers(){
        this.canvas.addEventListener('mousedown', e => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.pressed = true;
            //console.log(this.mouse)
        });

        this.canvas.addEventListener('mouseup', e => {
            this.mouse.x = e.offsetX;
            this.mouse.y = e.offsetY;
            this.mouse.pressed = false;
            //console.log(this.mouse)
        });

        this.canvas.addEventListener('mousemove', e => {
            if (this.mouse.pressed) {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
            }
            //console.log(this.mouse)
        });

        window.addEventListener( 'keydown', e => {
            if (e.key == 'd') this.debug = ! this.debug;
        });

        // this.canvas.addEventListener('wheel', e => {
        //     //this.mouse.x = e.offsetX;
        //     //this.mouse.y = e.offsetY;
        //     console.log(e.wheelDelta)
        //     this.player.speedFactor += 5*this.player.speedFactor/e.wheelDelta;
        // })
    }
}