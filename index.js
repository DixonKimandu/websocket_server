const webSocketServerPort = 8006;
const webSocketServer = require('websocket').server;
const http = require('http');

// Spinning up the http and websocket server
const server = http.createServer();
server.listen(webSocketServerPort);
console.log('Listening on port 8006');

const wsServer = new webSocketServer({
    httpServer: server
});

const clients = {};

// This code generates a unique userId for everyone
const getUniqueID = () => {
    const s4 = () => Math.floor((1 + Math.random()) + 0*10000).toString(16).substring(1);
    return s4() + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
    var userID = getUniqueID();
    console.log((new Date()) + ' Received a new connection from origin ' + request.origin + ',');

    // You can rewrite this part of the code to accept only requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(clients));

    connection.on('message', function(message) {
        if (message.type === 'utf8') {
            console.log('Received Message: ', message.utf8Data);

            // broadcasting message to all connected clients
            for(key in clients) {
                clients[key].sendUTF(message.utf8Data);
                console.log('Sent message to: ', clients[key]);
            }
        }
    })
});