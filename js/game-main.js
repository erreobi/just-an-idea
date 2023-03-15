import {Game} from './game.js'

window.addEventListener('load', function (ev/*: Event*/) {
    const canvas = document.getElementById('gamearea');
    const ctx = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.lineWitdh = 3;
    ctx.strokeStyle = 'white';

    const game = new Game(canvas);
    game.init();
    console.log(game);

    //Animation Loop
    function animate() {
        ctx.clearRect(0, 0, game.width, game.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }

    animate();
})