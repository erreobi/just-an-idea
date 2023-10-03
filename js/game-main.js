import {Game} from './game.js'

window.addEventListener('load', function (ev/*: Event*/) {
    const canvas = document.getElementById('gamearea');
    const ctx = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.lineWitdh = 3;
    ctx.strokeStyle = 'white';
    ctx.font = '40px Helvetica';

    const game = new Game(canvas);
    game.init();
    console.log(game);

    //Animation Loop
    let lastTime = 0
    function animate(timestamp) {
        const deltaTime = timestamp - lastTime;
        lastTime = timestamp;
        // console.log(deltaTime);
        game.render(ctx,deltaTime);
        requestAnimationFrame(animate);
    }

    animate(0);
})