# Tic Tac Toe

A real-time multiplayer Tic Tac Toe game with a neon glitch aesthetic, playable across devices via room-based matchmaking.

## Live Demo

[https://tic-tac-toe-production-ccf6.up.railway.app](https://tic-tac-toe-production-ccf6.up.railway.app)

## Features

- Real-time two-player gameplay over WebSockets
- Room creation and join via 6-character room codes
- Shareable room links for one-click joining
- Responsive layout for desktop, tablet, and mobile
- Touch support for mobile devices
- Neon glitch visual theme with canvas-based animations
- Synthesized audio feedback using the Web Audio API

## Tech Stack

| Layer     | Technology              |
|-----------|-------------------------|
| Server    | Node.js, `http` module  |
| Realtime  | WebSocket (`ws` library)|
| Client    | Vanilla HTML/CSS/JS     |
| Canvas    | HTML5 Canvas API        |
| Audio     | Web Audio API           |
| Hosting   | Railway                 |

## Project Structure

```
.
├── server.js          # HTTP + WebSocket server
├── tic-tac-toe.html   # Game client (single-file frontend)
└── package.json       # Dependencies
```

## Getting Started

### Prerequisites

- Node.js v10 or higher

### Installation

```bash
git clone https://github.com/mohnishnirvikar/Tic-Tac-Toe.git
cd Tic-Tac-Toe
npm install
```

### Running Locally

```bash
npm start
```

Open [http://localhost:3000](http://localhost:3000) in two browser tabs to test multiplayer.

## How to Play

1. Player 1 clicks **Create Room** — a 6-character room code is generated.
2. Click **Share Link** to copy the invite URL to clipboard.
3. Player 2 opens the shared link or manually enters the room code and clicks **Join Room**.
4. Once both players are connected, the game begins. X always goes first.
5. Click **Reboot SYS** to reset the board at any time.

## Deployment

The project is deployed on Railway. Any push to the `main` branch triggers an automatic redeploy.

To deploy your own instance:

1. Fork this repository.
2. Go to [railway.app](https://railway.app) and create a new project from your fork.
3. Railway auto-detects Node.js and runs `npm start`.
4. Generate a public domain under **Settings > Networking**.

## WebSocket Message Protocol

| Type           | Direction        | Payload                          |
|----------------|------------------|----------------------------------|
| `createRoom`   | Client -> Server | —                                |
| `roomCreated`  | Server -> Client | `{ room, player }`               |
| `joinRoom`     | Client -> Server | `{ room }`                       |
| `roomJoined`   | Server -> Client | `{ room, player }`               |
| `ready`        | Server -> Client | —                                |
| `move`         | Both             | `{ room, index, player }`        |
| `reset`        | Both             | `{ room }`                       |
| `opponentLeft` | Server -> Client | —                                |
| `error`        | Server -> Client | `{ error }`                      |

## License

MIT
