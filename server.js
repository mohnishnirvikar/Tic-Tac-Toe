const http = require('http');
const fs = require('fs');
const path = require('path');
const WebSocket = require('ws');

const PORT = process.env.PORT || 3000;
const publicDir = __dirname;
const contentTypeMap = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
};

const server = http.createServer((req, res) => {
  const parsedUrl = new URL(req.url, 'http://localhost');
  const urlPath = parsedUrl.pathname === '/' ? '/tic-tac-toe.html' : parsedUrl.pathname;
  const filePath = path.join(publicDir, decodeURIComponent(urlPath));
  if (!filePath.startsWith(publicDir)) {
    res.writeHead(400);
    return res.end('Bad request');
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      res.writeHead(404);
      return res.end('Not found');
    }

    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': contentTypeMap[ext] || 'application/octet-stream' });
    fs.createReadStream(filePath).pipe(res);
  });
});

const wss = new WebSocket.Server({ server });
const rooms = new Map();

function send(ws, payload) {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify(payload));
  }
}

function broadcast(roomCode, payload, excludeWs) {
  const room = rooms.get(roomCode);
  if (!room) return;
  room.clients.forEach((client) => {
    if (client !== excludeWs && client.readyState === WebSocket.OPEN) {
      send(client, payload);
    }
  });
}

function cleanupRoom(roomCode) {
  const room = rooms.get(roomCode);
  if (!room) return;
  room.clients = room.clients.filter((client) => client.readyState === WebSocket.OPEN);
  if (room.clients.length === 0) {
    rooms.delete(roomCode);
  }
}

function generateRoomCode() {
  const letters = 'ABCDEFGHJKMNPQRSTUVWXYZ';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += letters[Math.floor(Math.random() * letters.length)];
  }
  return code;
}

wss.on('connection', (ws) => {
  ws.room = null;
  ws.player = null;

  ws.on('message', (message) => {
    let data;
    try {
      data = JSON.parse(message.toString());
    } catch (err) {
      return send(ws, { type: 'error', error: 'Invalid message format' });
    }

    const { type, room, index, player } = data;

    if (type === 'createRoom') {
      let roomCode = generateRoomCode();
      while (rooms.has(roomCode)) {
        roomCode = generateRoomCode();
      }
      rooms.set(roomCode, { clients: [ws] });
      ws.room = roomCode;
      ws.player = 'X';
      send(ws, { type: 'roomCreated', room: roomCode, player: 'X' });
    }

    if (type === 'joinRoom') {
      const requestedRoom = String(room || '').toUpperCase();
      const roomState = rooms.get(requestedRoom);
      if (!roomState) {
        return send(ws, { type: 'error', error: 'Room not found' });
      }
      if (roomState.clients.length >= 2) {
        return send(ws, { type: 'error', error: 'Room is full' });
      }
      ws.room = requestedRoom;
      ws.player = 'O';
      roomState.clients.push(ws);
      send(ws, { type: 'roomJoined', room: requestedRoom, player: 'O' });
      roomState.clients.forEach((client) => send(client, { type: 'ready' }));
    }

    if (type === 'move') {
      if (!ws.room || !ws.player) {
        return send(ws, { type: 'error', error: 'Not joined to any room' });
      }
      if (ws.room !== room) {
        return send(ws, { type: 'error', error: 'Room mismatch' });
      }
      broadcast(ws.room, { type: 'move', index, player }, ws);
    }

    if (type === 'reset') {
      if (!ws.room) return;
      broadcast(ws.room, { type: 'reset' }, ws);
    }
  });

  ws.on('close', () => {
    if (!ws.room) return;
    const roomCode = ws.room;
    const room = rooms.get(roomCode);
    if (!room) return;
    broadcast(roomCode, { type: 'opponentLeft' }, ws);
    cleanupRoom(roomCode);
  });
});

server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
