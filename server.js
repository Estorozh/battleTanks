// Зависимости
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);

app.set('port', 5000);
app.use('/assets', express.static(__dirname + '/assets'));

// Маршруты
app.get('/', function(request, response) {
    response.sendFile(path.join(__dirname, 'index.html'));
});

// Запуск сервера
server.listen(5000, function() {
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
        player.name = data.name;
        player.x = data.x;
        player.y = data.y;
        player.direction = data.direction;
        player.transform = data.transform;
    });

    socket.on('start',(walls) => {
        io.sockets.emit('renderWorld', walls);
    });

    socket.on('broken', () => {
        socket.broadcast.emit('broken')
    })
});

setInterval(function() {
    io.sockets.emit('statePlayers', players);
}, 1000/60);


// io.sockets.on('theWalls',(data) => { console.log('get option walls '); io.sockets.emit('stateWalls', data) });



// const server = require('http').createServer();
// const io = require('socket.io')(server);
// io.on('connection', client => {
//     client.on('event', data => { /* … */ });
//     client.on('disconnect', () => { /* … */ });
// });
// server.listen(3000);