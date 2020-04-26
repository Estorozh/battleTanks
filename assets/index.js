//сделать трак, стрельбу, возможность второго игрока
var socket = io();

let fieldGame = document.querySelector('.fieldGame'),
    firstPlayer = {
        el: false,
        x: Math.random(0, fieldGame.getBoundingClientRect().width)*1000,
        y: Math.random(0, fieldGame.getBoundingClientRect().height)*700,
        speed: 5,
        run: false,
        name: 'player',
        direction: 'top',
        transform: 'rotate(0deg)',
    },
    // anotherPlayer = {
    //     el: false,
    //     x: 0,
    //     y: 0,
    //     speed: 5,
    //     run: false,
    //     name: 'player',
    //     direction: 'top',
    // },
    bullets = {
        speed: 5,
    },
    wallCount = 10,
    walls = [];
firstPlayer.name = prompt('введите ваш ник', "player");

function startGame() {
    fieldGame.innerHTML = '';
    // walls = [];

    fieldGame.innerHTML += `<div class="player firstPlayer" style="left: ${firstPlayer.x}px; top: ${firstPlayer.y}px;"></div>`;
    firstPlayer.el = document.querySelector('.firstPlayer');

    for(i=0; i < wallCount; i++) {
        createWall();
    }

    let theWalls = document.querySelectorAll('.wall');
    theWalls.forEach((wall)=> {
        let obj = {
            'left': wall.style.left,
            'top': wall.style.top
        };
        wall.style.transform ? obj.transform = true : null;

        walls.push(obj);
    });

    socket.emit('start', walls);
}

function addFirstPlayer() {
    fieldGame.innerHTML += `<div class="player firstPlayer" style="left: ${firstPlayer.x}px; top: ${firstPlayer.y}px;"></div>`;
    firstPlayer.el = document.querySelector('.firstPlayer');
}

function addAnotherPlayer(anotherPlayer) {
    if(!document.querySelector('.anotherPlayer')){
        let tank = document.createElement('div');
        tank.className = 'player anotherPlayer';
        fieldGame.append(tank)
    }

    tank = document.querySelector('.anotherPlayer');
    tank.style.cssText = `transform: ${anotherPlayer.transform}; left: ${anotherPlayer.x}px; top: ${anotherPlayer.y}px;`;
}

function createWall(theWall) {
    let wall = document.createElement('div');
    wall.classList.add('wall');
    if(!theWall) {
        if (Math.random() * 10 > 5) wall.style.transform = "rotate(90deg)";
        wall.style.left = Math.random(0, fieldGame.getBoundingClientRect().width) * 1000 + 'px';
        wall.style.top = Math.random(0, fieldGame.getBoundingClientRect().height) * 700 + 'px';
    } else {
        if(theWall.transform) wall.style.transform = "rotate(90deg)";
        wall.style.left = theWall.left;
        wall.style.top = theWall.top;
    }

    fieldGame.append(wall);
}

function shoot () {
    let bullet = document.createElement('div');
    bullet.classList.add('bullet');

    bullet.style.left = `${firstPlayer.x}px`;
    bullet.style.top = `${firstPlayer.y}px`;

    fieldGame.append(bullet);

    function actionShoot (bullet, direction) {
        let walls = document.querySelectorAll('.wall');

        switch (direction) {
            case 'top':
                bullet.style.left = parseInt(bullet.style.left) + 14 + 'px';
                bullet.style.top = parseInt(bullet.style.top) - 14 + 'px';
                let shootFlyTop = setInterval(() => {
                    bullet.style.top = parseInt(bullet.style.top) - bullets.speed+'px';

                    walls.forEach(wall=> {
                        if (
                            Math.abs(bullet.getBoundingClientRect()[direction] - wall.getBoundingClientRect()['bottom']) < 5 &&
                            bullet.getBoundingClientRect().right > wall.getBoundingClientRect().left &&
                            bullet.getBoundingClientRect().left < wall.getBoundingClientRect().right
                        ) {
                            bullet.remove();
                        }
                    });

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

                    walls.forEach(wall=> {
                        if (
                            Math.abs(bullet.getBoundingClientRect()[direction] - wall.getBoundingClientRect()['right']) < 5 &&
                            bullet.getBoundingClientRect().bottom > wall.getBoundingClientRect().top &&
                            bullet.getBoundingClientRect().top < wall.getBoundingClientRect().bottom
                        ) {
                            bullet.remove();
                        }
                    });

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

                    walls.forEach(wall=> {
                        if (
                            Math.abs(bullet.getBoundingClientRect()[direction] - wall.getBoundingClientRect()['right']) < 5 &&
                            bullet.getBoundingClientRect().bottom > wall.getBoundingClientRect().top &&
                            bullet.getBoundingClientRect().top < wall.getBoundingClientRect().bottom
                        ) {
                            bullet.remove();
                        }
                    });

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

                    walls.forEach(wall=> {
                        if (
                            Math.abs(bullet.getBoundingClientRect()[direction] - wall.getBoundingClientRect()['top']) < 5 &&
                            bullet.getBoundingClientRect().right > wall.getBoundingClientRect().left &&
                            bullet.getBoundingClientRect().left < wall.getBoundingClientRect().right
                        ) {
                            bullet.remove();
                        }
                    });

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
                firstPlayer.direction = 'left'; firstPlayer.transform = 'rotate(-90deg)';
                changeX(-90);
                break;
            case 38:
                firstPlayer.direction = 'top'; firstPlayer.transform = 'rotate(0deg)';
                changeY(0);
                break;
            case 39:
                firstPlayer.direction = 'right'; firstPlayer.transform = 'rotate(90deg)';
                changeX(90);
                break;
            case 40:
                firstPlayer.direction = 'bottom'; firstPlayer.transform = 'rotate(180deg)';
                changeY(180);
                break;
        }

        function changeY(deg) {
            firstPlayer.el.style.transform = `rotate(${deg}deg)`;
            if(firstPlayer.y < 0)
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
            if(firstPlayer.x < 0)
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

controll();


socket.emit('new player');

setInterval(function() {
    socket.emit('firstPlayer', firstPlayer);
}, 1000/60);

socket.on('statePlayers', function(players) {
    players[socket.id]=null;
    for (key in players) {
        if(players[key]) addAnotherPlayer(players[key]);
    }

});

socket.on('renderWorld', (walls) => {
    walls.forEach((theWall)=>{createWall(theWall)});
    if(!document.querySelector('.firstPlayer')) addFirstPlayer();
});