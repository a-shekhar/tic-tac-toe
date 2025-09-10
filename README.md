# TicTacToe — Full Stack (Spring Boot + React + Tailwind 4.1.5)

This zip contains a backend (Java 21, Spring Boot) and a frontend (Vite + React + Tailwind v4.1.5),
wired together. The frontend proxies `/api` calls to the backend during development.

## Prereqs
- **Java 21+** installed
- **Node 18+** (or 20+) installed
- Internet access (for Maven wrapper first run)

## Run (local dev)

### 1) Start backend
```bash
cd server
./mvnw spring-boot:run        # macOS/Linux
# or on Windows:
mvnw.cmd spring-boot:run
```
Backend runs on **http://localhost:8080**.

### 2) Start frontend
```bash
cd client
npm i
npm run dev
```
Frontend runs on **http://localhost:5173** and proxies `/api` → `http://localhost:8080`.

## API
- `POST /api/games` – create a new game
- `GET /api/games/{id}` – get current state
- `POST /api/games/{id}/move` – `{ row, col }` (0..2)
- `POST /api/games/{id}/cpu-move` – server places best move for current player
- `POST /api/games/{id}/reset` – reset board

**Response:**
```json
{
  "success": true,
  "message": "OK",
  "game": {
    "gameId": "uuid",
    "board": ["X", null, "O", ...],
    "currentPlayer": "X",
    "winner": null,
    "draw": false,
    "winningLine": [0,4,8]
  }
}
```

## Notes
- The CPU endpoint always plays **for the current player**. The frontend calls it only when it's the CPU's turn.
- In dev, proxy avoids CORS headaches; CORS is also enabled on the server for localhost:5173.
- To build a JAR: `cd server && ./mvnw -q -DskipTests package` then run with `java -jar target/*.jar`.


## Windows quick commands (Maven installed globally)
From the project root after unzipping:

- Start both windows (server + client):
  ```bat
  run-all-windows.cmd
  ```

- Only backend (Spring Boot via Maven):
  ```bat
  run-server-mvn.cmd
  ```

- Build runnable JAR and run it:
  ```bat
  build-jar.cmd
  run-jar.cmd
  ```

- Only frontend:
  ```bat
  cd client
  dev.cmd
  ```
