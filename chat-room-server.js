/**
 * Created by David Welch on 8/14/2016.
 *
 * Copyright (C) 2017  David Welch
 *
 * This program is free software; you can redistribute it and/or
 * modify it under the terms of the GNU General Public License
 * as published by the Free Software Foundation; either version 2
 * of the License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program; if not, write to the Free Software
 * Foundation, Inc., 51 Franklin Street, Fifth Floor, Boston, MA  02110-1301, USA.
 */

const webSocketPort = 4202;
const secret = 'don\'t tell anybody this';

const WebSocket = require('ws');
const crypto = require('crypto');

const server = new WebSocket.Server({ port: webSocketPort });
let users = {};

function createMessageString(author, message, size, bold, italic) {
    return JSON.stringify({
        author: author,
        message: message,
        size: size,
        bold: bold,
        italic: italic
    });
}

server.broadcastMessage = function broadcast(author, message, size, bold, italic) {
    this.broadcast(createMessageString(author, message, size, bold, italic));
};

server.broadcast = function broadcast(data) {
    console.log(`sending: ${data}`);
    server.clients.forEach(function each(client) {
        if(client.readyState === WebSocket.OPEN) {
            client.send(data);
        }
    });
};

server.on('connection', function connection(socket) {
    console.log('user connected');

    socket.sendMessage = function(author, message, size, bold, italic) {
        console.log(`Sending message: ${message}`);
        this.send(createMessageString(author, message, size, bold, italic));
    };

    function hashString(inputString) {
        return crypto.createHmac('sha256', secret)
            .update(inputString)
            .digest('hex');
    }

    function sendUpdatedUserList() {
        let simplifiedUserList = [];
        for (const hash in users) {
            simplifiedUserList.push(users[hash]);
        }
        server.broadcast(JSON.stringify({users: simplifiedUserList}));
    }

    function createNewUser(name) {
        const hashedString = hashString(name);
        if(!users[hashedString]) {
            console.log(`user[${hashedString}] = ${name}`);
            users[hashedString] = name;
            console.log('Sending chat room key');
            return hashedString;
        } else {
            console.log('Sending "Username taken"');
            return 'Username taken';
        }
    }

    socket.on('message', function incoming(data) {
        console.log(`data: ${data}`);
        let dataObj = JSON.parse(data);
        if(dataObj.message && users[dataObj.chatRoomKey]) {
            console.log(`message received: ${dataObj.message}`);
            server.broadcastMessage(users[dataObj.chatRoomKey], dataObj.message, dataObj.size, dataObj.bold, dataObj.italic);
        } else if(users[dataObj.chatRoomKey]) {
            server.broadcastMessage('Server', `${users[dataObj.chatRoomKey]} has joined the chat room.`);
            console.log(`user joined: ${users[dataObj.chatRoomKey]}`);
            sendUpdatedUserList();
        } else if(dataObj.name) {
            socket.send(createNewUser(dataObj.name));
        } else {
            socket.sendMessage('Server', 'Invalid username');
        }
    });
});

console.log(`Listening for WebSocket connection on ${webSocketPort}`);