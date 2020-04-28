// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', process.env.PORT || 5000);
app.use('/assets', express.static(__dirname + '/assets'));

// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
server.listen(process.env.PORT || 5000, function() {
    console.log('Запускаю сервер на порте 5000');
});


var players = {};
io.on('connection', function(socket) {
    socket.on('new player', function(data) {
        players[socket.id] = {
            el: false,
            x: Math.random(0, 1)*1000,
            y: Math.random(0, 1)*700,
            speed: 5,
            run: false,
            direction: 'top',
        };
    });

    socket.on('firstPlayer', function(data) {
        var player = players[socket.id] || {};
        // player.name = data.name;
        player.x = data.x;
        player.y = data.y;
        player.direction = data.direction;
        player.transform = data.transform;
        player.health = data.health;
    });

    socket.on('start',(walls) => {
        socket.broadcast.emit('renderWorld', walls);
    });

    socket.on('broken', () => {
        socket.broadcast.emit('broke')
    });

    socket.on('newShoot', (bullet, direction) => {
        socket.broadcast.emit('newBullet', bullet, direction);
    });

    socket.on('GameOver', () => {
        socket.broadcast.emit('Winner')
    });

    setInterval(function() {
        socket.broadcast.emit('statePlayers', players);
    }, 1000/60);
});