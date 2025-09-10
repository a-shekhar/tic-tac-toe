# Tic-Tac-Toe — React Only (No Backend)

- React 18 + Vite + Tailwind CSS v4
- Player vs Player and Player vs CPU (smart heuristic)
- Highlights winning line, scoreboard, reset round/scores
- Fully client-side: deploy to any static host (Vercel, Netlify, GitHub Pages)

## Run locally
```bash
npm i
npm run dev
# open http://localhost:5174
```

## Build for production
```bash
npm run build
npm run preview   # serves the built app at http://localhost:5174 for a quick check
```

## Deploy (Vercel)
- Import this folder as a project.
- Build command: `npm run build`
- Output directory: `dist`
- No server required, no environment variables needed.
