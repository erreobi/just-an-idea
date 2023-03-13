window.addEventListener('load', function(ev/*: Event*/){
    const canvas = document.getElementById('gamearea');
    const ctx = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.lineWitdh = 3;
    ctx.strokeStyle = 'white';

    class Player {
        constructor(game){
            this.game = game;
            this.collisionX = game.width * 0.5;
            this.collisionY = game.height * 0.5;
            this.collisionRadius = 50;
        }

        draw (context){
            context.beginPath();
            context.arc(this.collisionX,this.collisionY,this.collisionRadius,0, Math.PI * 2);
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();

        }

        update(){
            this.collisionX = this.game.mouse.x;
            this.collisionY = this.game.mouse.y;
        }
    }

    // it will manager the game logic and dynamics
    class Game {
        constructor(canvas){
            this.canvas = canvas;
            this.width = this.canvas.width;
            this.height = this.canvas.height;
            this.player = new Player(this);
            this.mouse = {
                x: this.width * 0.5,
                y: this.height * 0.5,
                pressed: false
            }

            this.canvas.addEventListener('mousedown', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
                //console.log(this.mouse)
            })
            this.canvas.addEventListener('mouseup', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
                //console.log(this.mouse)
            })
            this.canvas.addEventListener('mousemove', e => {
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                //console.log(this.mouse)
            })
        }

        render (context){
            this.player.draw(context);
            this.player.update();
        }

    }

    const game = new Game(canvas);
   
    console.log(game);

    //Animation Loop
    function animate(){
        ctx.clearRect(0,0, game.width, game.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }

    animate();
})