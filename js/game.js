import { Player } from './player.js'
import { Obstacle } from './obstacle.js'
import { Egg } from './egg.js'

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
        //Players
        this.player = new Player(this);
        //Obstacles
        this.obastacles = [];
        this.numberOfObstacles = 20;
        //Eggs
        this.eggs = [];
        this.numberOfEggs = 100;
        this.eggTimer = 0;
        this.eggInterval = 100; //millisecond


        //Debug Version
        this.debug = true;
        
        //Controlling the FPS
        this.fps = 60; // it is the default value for most of the screens
        this.interval = 1000/this.fps;
        this.timer = 0;

    }

    addEgg()
    {
        const egg = new Egg(this);
    
        this.eggs.push(egg);
    }

    init(){

        // add the obstacles in the game. 
        // - They obstacle should be in a specific position of the canvas.
        // - They should not collide.
        // - They should have enough space each other.
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

    render(context, deltaTime) {
       // console.log(deltaTime, this.timer, this.interval);
        if (this.timer > this.interval)
        {
            context.clearRect(0, 0, this.width, this.height);

            this.obastacles.forEach(obstacle => obstacle.draw(context));
            
            this.player.draw(context);
            this.player.update();
            this.timer = 0;

            this.eggs.forEach(egg => egg.draw(context));

        }
        this.timer += deltaTime; 

        //Add an egg each interval
        if (this.eggs.length <= this.numberOfEggs)
        {
            if  (this.eggTimer > this.eggInterval){
                this.addEgg();
                this.eggTimer = 0;
            } else{
                this.eggTimer += deltaTime;
            }
        }

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