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

## Deployment (Render)

This project can be deployed on Render as a simple Node.js web service. Render provides automatic builds and will set the `PORT` environment variable for your service.

To deploy on Render:

1. Push this repository to GitHub (if not already pushed).
2. Sign in to https://render.com and create a new **Web Service**.
3. Connect your GitHub repo and select the branch `master` to deploy from.
4. Set the **Build Command** to `npm install` and the **Start Command** to `npm start` (Render often auto-detects these).
5. Choose the Node environment and an instance plan (the Free tier is available for small projects).
6. Enable **Auto Deploys** from the selected branch to redeploy on each push.

Notes:
- Render exposes a `PORT` environment variable; `server.js` already uses `process.env.PORT` so no code change is needed.
- You can also add a `render.yaml` manifest to the repo for declarative setup (already included).
- After the service is live, share the Render URL with players. Room links like `https://your-service.url/?room=ABCDEF` will let others join directly.

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
