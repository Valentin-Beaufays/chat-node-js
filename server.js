const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);
const fs = require('fs');

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

app.get('/api/message', (req, res) => {
    fs.readFile('message.json', (err, data) => {
        if (err) throw err;
        let message = JSON.parse(data);
        console.log(message);
        res.send(message);
    });
});

io.on('connection', function (socket) {
    console.log('a user connected');
    socket.on('chat message', function (msg) {
        if (msg.trim() !== "") {
            fs.readFile('message.json', function (err, data) {
                var json = JSON.parse(data);
                json.message.push(msg);
                fs.writeFileSync("message.json", JSON.stringify(json));
            });
            io.emit('chat message', msg);
        }
    });
    socket.on('disconnect', function () {
        console.log('user disconnected');
    });
});

http.listen(3000, function () {
    console.log('listening on localhost:3000');
});