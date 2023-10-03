import { Player } from './player.js'
import { Obstacle } from './obstacle.js'
import { Egg } from './egg.js'
import { Monster } from './monster.js'
import { Larva } from './larva.js'
import { Particle } from './particles.js'

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
        this.numberOfEggs = 5;
        this.eggTimer = 0;
        this.eggInterval = 500; //millisecond

        this.monsters = [];
        this.numberOfMonsters = 4;
        this.monsterTime = 0;
        this.monsterInterval = 500;

        this.larvas = [];
        this.particles = [];

        //Debug Version
        this.debug = false;
        
        //Controlling the FPS
        this.fps = 60; // it is the default value for most of the screens
        this.interval = 1000/this.fps;
        this.timer = 0;

        this.score = 0;
        this.hatchingKilled = 0;
        this.scoreUpdated = false;

        this.gameOver = false;

    }

    increaseScore(){
        this.score ++; 
        this.scoreUpdated = true;
    }
    increaseHatchingKilled(){
        this.hatchingKilled++;
        this.scoreUpdated = true;
    }

    addParticle(particle)
    {
        this.particles.push(particle);
    }

    addEgg()
    {
        const egg = new Egg(this);
        this.eggs.push(egg);
    }

    addLarva(collisionX,collisionY)
    {
        const larva = new Larva(this,collisionX, collisionY);
        this.larvas.push(larva);
    }

    addMonster()
    {
        const monster = new Monster(this);
        this.monsters.push(monster);
    }

    removeObjects()
    {
        this.eggs = this.eggs.filter((egg) => !egg.markForRemoval);
        this.larvas = this.larvas.filter((larva) => !larva.markForRemoval);
        this.particles = this.particles.filter((particle) => !particle.markForRemoval);
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

            //the obectjs create as a last will be always visible. 
            let objects = [...this.eggs, 
                ...this.obastacles, 
                ...this.monsters, 
                ...this.larvas,
                ...this.particles, 
                this.player];
        
            //sorting the distances to have an 3d effect
            objects.sort((a,b)=>{return a.collisionY-b.collisionY});

            objects.forEach(object => {
                object.draw(context)
                object.update(context,deltaTime);
            });

            this.timer = 0;

            if (this.score >= 5){
                this.gameOver = true;
                context.save();
    
                context.fillStyle='rgba(0,0,0,0.5)';
                context.fillRect(0,0,this.width, this.height);

                context.fillStyle='white';
                context.textAlign='center';
                let message1;
                let message2;
                if (this.hatchingKilled > 5){
                    message1="Game Over"
                    message2="Oh nooo ... too many hatchlinks has been killed."
                }else{
                    message1="Well Done!!"
                    message2="the hatchlink are in a secure place now...well pushed"
                }
                context.font='130px Bangers';
                context.fillText(message1, this.width*0.5, this.height*0.5-20);
                context.font='40px Bangers';
                context.fillText(message2, this.width*0.5, this.height*0.5+30);
                context.fillText("Press R to restart the game", this.width*0.5, this.height*0.5+80);
    
                context.restore();
            }
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
        //Add an monster each interval
        if (this.monsters.length < this.numberOfMonsters)
        {
            // console.log("this.monsters.length: "+this.monsters.length);
            if  (this.monsterTime > this.monsterInterval){
                this.addMonster();
                this.monsterTime = 0;
            } else{
                this.monsterTime += deltaTime;
            }
        }

        context.save();
        context.textAlign = 'left';
        context.font='40px Bangers';
        context.fillText("Score: "+this.score, 20,50);
        context.fillText("Hatchlinks Killed: "+this.hatchingKilled, 20,90);
        context.restore();

    }

    restart(){
        this.mouse = {
            x: this.width * 0.5,
            y: this.height * 0.5,
            pressed: false
        }
        this.gameOver = false;
        this.player.restart();

        this.eggs=[];
        this.obastacles=[];
        this.monsters=[];
        this.larvas=[];
        this.particles=[];
        
        this.init();
        this.score = 0;
        this.hatchingKilled = 0;


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
            if (e.key == 'd') {
              this.debug = ! this.debug;
            }else if (e.key == 'r' ) {
                this.restart();
            }
        });

        // this.canvas.addEventListener('wheel', e => {
        //     //this.mouse.x = e.offsetX;
        //     //this.mouse.y = e.offsetY;
        //     console.log(e.wheelDelta)
        //     this.player.speedFactor += 5*this.player.speedFactor/e.wheelDelta;
        // })
    }
}