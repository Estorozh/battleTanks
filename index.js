//сделать трак, стрельбу, возможность второго игрока

let fieldGame = document.querySelector('.fieldGame'),
    firstPlayer = {
        el: false,
        x: Math.random(0, fieldGame.getBoundingClientRect().width)*1000,
        y: Math.random(0, fieldGame.getBoundingClientRect().height)*700,
        speed: 5,
        run: false,
        name: 'player',
        direction: 'top',
    },
    bullets = {
        speed: 10,
    },
    wallCount = 20,
    // objWall = []
    walls;

function startGame() {
    fieldGame.innerHTML += `<div class="player firstPlayer" style="left: ${firstPlayer.x}px; top: ${firstPlayer.y}px;"></div>`;
    firstPlayer.el = document.querySelector('.player');
    for(i=0; i < wallCount; i++) {
        createWall();
    }
}

function createWall() {
    let wall = document.createElement('div');
    wall.classList.add('wall');
    if (Math.random()*10>5) wall.style.transform = "rotate(90deg)";
    wall.style.left = Math.random(0, fieldGame.getBoundingClientRect().width)*1000 + 'px';
    wall.style.top = Math.random(0, fieldGame.getBoundingClientRect().height)*700 + 'px';
    fieldGame.append(wall);
}

function shoot () {
    let bullet = document.createElement('div');
    bullet.classList.add('bullet');

    bullet.style.left = `${firstPlayer.x}px`;
    bullet.style.top = `${firstPlayer.y}px`;

    fieldGame.append(bullet);

    function actionShoot (bullet, direction) {
        switch (direction) {
            case 'top':
                bullet.style.left = parseInt(bullet.style.left) + 14 + 'px';
                bullet.style.top = parseInt(bullet.style.top) - 14 + 'px';
                let shootFlyTop = setInterval(() => {
                    bullet.style.top = parseInt(bullet.style.top) - bullets.speed+'px';
                    if(bullet.getBoundingClientRect().y < fieldGame.getBoundingClientRect().y-25) {
                        clearInterval(shootFlyTop);
                    }
                }, 1000/60);
                break;
            case 'left':
                bullet.style.left = parseInt(bullet.style.left) - 24 + 'px';
                bullet.style.top = parseInt(bullet.style.top) + 24 + 'px';
                let shootFlyLeft = setInterval(() => {
                    bullet.style.left = parseInt(bullet.style.left) - bullets.speed+'px';
                    if(bullet.getBoundingClientRect().x < fieldGame.getBoundingClientRect().x-30) {
                        clearInterval(shootFlyLeft);
                    }
                }, 1000/60);
                break;
            case 'right':
                bullet.style.left = parseInt(bullet.style.left) + 50 + 'px';
                bullet.style.top = parseInt(bullet.style.top) + 24 + 'px';
                let shootFlyRight = setInterval(() => {
                    bullet.style.left = parseInt(bullet.style.left) + bullets.speed+'px';
                    if(bullet.getBoundingClientRect().x > fieldGame.getBoundingClientRect().width+30) {
                        clearInterval(shootFlyRight);
                    }
                }, 1000/60);
                break;
            case 'bottom':
                bullet.style.left = parseInt(bullet.style.left) + 14 + 'px';
                bullet.style.top = parseInt(bullet.style.top) + 60 + 'px';
                let shootFlyBottom = setInterval(() => {
                    bullet.style.top = parseInt(bullet.style.top) + bullets.speed+'px';
                    if(bullet.getBoundingClientRect().y > fieldGame.getBoundingClientRect().height+25) {
                        clearInterval(shootFlyBottom);
                    }
                }, 1000/60);
                break;
        }

    }

    return actionShoot(bullet, firstPlayer.direction);
}

function controll() {
    document.addEventListener('keydown', (e)=>{
        if([32,37,38,39,40].includes(e.keyCode)) {
            e.preventDefault();
        }

        switch (e.keyCode) {
            case 32:
                shoot();
                break;
            case 37:
                firstPlayer.direction = 'left';
                changeX(-90);
                break;
            case 38:
                firstPlayer.direction = 'top';
                changeY(0);
                break;
            case 39:
                firstPlayer.direction = 'right';
                changeX(90);
                break;
            case 40:
                firstPlayer.direction = 'bottom';
                changeY(180);
                break;
        }

        function changeY(deg) {
            firstPlayer.el.style.transform = `rotate(${deg}deg)`;
            if(firstPlayer.y <= 0)
                return firstPlayer.y = 0;
            if(firstPlayer.y >= fieldGame.getBoundingClientRect().height)
                return firstPlayer.y = fieldGame.getBoundingClientRect().height;

            checkWall();
            if (firstPlayer.run) {
                deg ? firstPlayer.y += firstPlayer.speed : firstPlayer.y -= firstPlayer.speed;
                firstPlayer.el.style.top = `${firstPlayer.y}px`;
            } else {
                deg ? firstPlayer.y -= firstPlayer.speed+5 : firstPlayer.y += firstPlayer.speed+5;
                firstPlayer.el.style.top = `${firstPlayer.y}px`;
            }
        }

        function changeX(deg) {
            firstPlayer.el.style.transform = `rotate(${deg}deg)`;
            if(firstPlayer.x <= 0)
                return firstPlayer.x = 0;
            if(firstPlayer.x >= fieldGame.getBoundingClientRect().width)
                return firstPlayer.x = fieldGame.getBoundingClientRect().width;

            checkWall();
            if (firstPlayer.run) {
                deg + 90 ? firstPlayer.x += firstPlayer.speed : firstPlayer.x -= firstPlayer.speed;
                firstPlayer.el.style.left = `${firstPlayer.x}px`;
            } else {
                deg + 90 ? firstPlayer.x -= firstPlayer.speed +  5 : firstPlayer.x += firstPlayer.speed+5;
                firstPlayer.el.style.left = `${firstPlayer.x}px`;
            }
        }

        function checkWall() {
            let walls = document.querySelectorAll('.wall'),
                playerCoords = {
                    top: firstPlayer.el.getBoundingClientRect().top,
                    right: firstPlayer.el.getBoundingClientRect().right,
                    left: firstPlayer.el.getBoundingClientRect().left,
                    bottom: firstPlayer.el.getBoundingClientRect().bottom,
                },
                stop = false;

            walls.forEach( (wall) => {
                let wallCoords = {
                    top: wall.getBoundingClientRect().top,
                    right: wall.getBoundingClientRect().right,
                    left: wall.getBoundingClientRect().left,
                    bottom: wall.getBoundingClientRect().bottom
                };

                if (
                    playerCoords.top < wallCoords.bottom &&
                    playerCoords.bottom > wallCoords.top &&
                    playerCoords.right > wallCoords.left &&
                    playerCoords.left < wallCoords.right
                ) { stop = true; }
            });

            stop ? firstPlayer.run = false : firstPlayer.run = true;
        }

    });

}

startGame();
controll();