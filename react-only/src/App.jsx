import React, { useEffect, useMemo, useState } from 'react'

const LINES = [
  [0, 1, 2],[3, 4, 5],[6, 7, 8],
  [0, 3, 6],[1, 4, 7],[2, 5, 8],
  [0, 4, 8],[2, 4, 6],
]

function calculateWinner(board) {
  for (const [a,b,c] of LINES) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { player: board[a], line: [a,b,c] }
    }
  }
  return null
}

function getEmptySquares(board) {
  const out = []
  for (let i=0;i<9;i++) if (!board[i]) out.push(i)
  return out
}
const pickRandom = (arr) => arr[Math.floor(Math.random()*arr.length)]

function getCpuMove(board, cpu, human) {
  const empties = getEmptySquares(board)
  if (!empties.length) return null
  // 1) Win
  for (const i of empties) {
    const clone = board.slice(); clone[i]=cpu
    if (calculateWinner(clone)) return i
  }
  // 2) Block
  for (const i of empties) {
    const clone = board.slice(); clone[i]=human
    if (calculateWinner(clone)) return i
  }
  // 3) Center
  if (board[4] == null) return 4
  // 4) Corners
  const corners = [0,2,6,8].filter(i => board[i]==null)
  if (corners.length) return pickRandom(corners)
  // 5) Sides
  const sides = [1,3,5,7].filter(i => board[i]==null)
  if (sides.length) return pickRandom(sides)
  return pickRandom(empties)
}

function Cell({ value, onClick, isWinning, disabled, index }) {
  return (
    <button
      aria-label={`Cell ${index + 1}${value ? ` with ${value}` : ''}`}
      onClick={onClick}
      disabled={disabled}
      className={[
        'relative aspect-square w-full select-none rounded-2xl border',
        'border-white/15 bg-white/5 backdrop-blur-sm',
        'transition active:scale-[0.98]',
        disabled ? 'opacity-60 cursor-not-allowed' : 'hover:bg-white/10',
        isWinning ? 'ring-4 ring-emerald-400/70' : '',
        'flex items-center justify-center',
      ].join(' ')}
    >
      <span className={[
          'text-4xl sm:text-5xl font-extrabold leading-none',
          value === 'X'
            ? 'text-violet-400 drop-shadow-[0_1px_8px_rgba(167,139,250,0.35)]'
            : value === 'O'
            ? 'text-teal-300 drop-shadow-[0_1px_8px_rgba(94,234,212,0.35)]'
            : 'text-white/30',
        ].join(' ')}
      >
        {value || '\u00A0'}
      </span>
    </button>
  )
}

export default function App() {
  const [board, setBoard] = useState(Array(9).fill(null))
  const [xIsNext, setXIsNext] = useState(true)
  const [mode, setMode] = useState('CPU') // 'PVP' | 'CPU'
  const [userPlays, setUserPlays] = useState('X') // CPU mode: user's mark
  const [scores, setScores] = useState({ X: 0, O: 0, draws: 0 })

  const winner = useMemo(() => calculateWinner(board), [board])
  const full = useMemo(() => board.every(Boolean), [board])
  const gameOver = !!winner || full
  const currentPlayer = xIsNext ? 'X' : 'O'
  const hasMoves = useMemo(() => board.some(Boolean), [board])

  const cpuMark = userPlays === 'X' ? 'O' : 'X'
  const humanMark = userPlays

  function placeMove(i, mark, currBoard = board) {
    if (currBoard[i] || gameOver) return
    const next = currBoard.slice()
    next[i] = mark
    setBoard(next)
    setXIsNext(mark === 'X' ? false : true)

    const check = calculateWinner(next)
    const filled = next.every(Boolean)
    if (check) setScores(s => ({ ...s, [mark]: s[mark] + 1 }))
    else if (filled) setScores(s => ({ ...s, draws: s.draws + 1 }))
  }

  function handleCellClick(i) {
    if (gameOver || board[i]) return
    if (mode === 'CPU') {
      if (currentPlayer !== humanMark) return
      placeMove(i, humanMark)
    } else {
      placeMove(i, currentPlayer)
    }
  }

  // CPU turn
  useEffect(() => {
    if (mode !== 'CPU' || gameOver) return
    if (currentPlayer !== cpuMark) return
    const id = setTimeout(() => {
      const move = getCpuMove(board, cpuMark, humanMark)
      if (move != null) placeMove(move, cpuMark)
    }, 420)
    return () => clearTimeout(id)
  }, [mode, currentPlayer, cpuMark, humanMark, board, gameOver])

  function resetRound() { setBoard(Array(9).fill(null)); setXIsNext(true) }
  function resetScores() { setScores({ X: 0, O: 0, draws: 0 }) }

  const status = (() => {
    if (winner) return `Winner: ${winner.player}`
    if (full) return 'Draw'
    if (mode === 'CPU') return currentPlayer === humanMark ? `Your turn (${humanMark})` : 'CPU is thinking…'
    return `Turn: ${currentPlayer}`
  })()

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-900 via-slate-950 to-black text-slate-100">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-14">
        <header className="mb-8 sm:mb-10 flex items-center justify-between gap-4">
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Tic-Tac-Toe <span className="text-violet-300">React</span>
            <span className="text-slate-500"> × </span>
            <span className="text-teal-300">Tailwind</span>
          </h1>
          <div className="hidden sm:flex items-center gap-3 text-sm">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10">
              <span className="h-2 w-2 rounded-full bg-violet-400" />
              X: <strong className="tabular-nums">{scores.X}</strong>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10">
              <span className="h-2 w-2 rounded-full bg-teal-300" />
              O: <strong className="tabular-nums">{scores.O}</strong>
            </span>
            <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 border border-white/10">
              Draws: <strong className="tabular-nums">{scores.draws}</strong>
            </span>
          </div>
        </header>

        <div className="grid gap-6 lg:grid-cols-[1fr_420px]">
          {/* Board */}
          <section className="order-2 lg:order-1">
            <div className="mx-auto max-w-md">
              <div className="mb-4 flex items-center justify-between">
                <div className="text-base sm:text-lg font-semibold">{status}</div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                {board.map((val, i) => (
                  <Cell
                    key={i}
                    index={i}
                    value={val}
                    onClick={() => handleCellClick(i)}
                    isWinning={winner ? winner.line.includes(i) : false}
                    disabled={!!val || gameOver || (mode === 'CPU' && currentPlayer !== humanMark)}
                  />
                ))}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <button onClick={resetRound} className="rounded-xl bg-violet-500/90 px-4 py-2 text-sm font-semibold shadow hover:bg-violet-500 active:scale-[0.99]">
                  Reset Round
                </button>
                <button onClick={resetScores} className="rounded-xl bg-teal-500/90 px-4 py-2 text-sm font-semibold shadow hover:bg-teal-500 active:scale-[0.99]">
                  Reset Scores
                </button>
              </div>
            </div>
          </section>

          {/* Settings */}
          <aside className="order-1 lg:order-2">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-5 sm:p-6">
              <h2 className="mb-4 text-lg font-bold text-white/90">Game Settings</h2>

              <div className="mb-5">
                <div className="mb-2 text-sm font-medium text-white/80">Mode</div>
                <div className="inline-grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10">
                  <button
                    onClick={() => setMode('PVP')}
                    disabled={mode === 'PVP'}
                    className={['px-4 py-2.5 text-sm font-semibold', mode === 'PVP' ? 'bg-violet-500 text-white' : 'bg-white/5 hover:bg-white/10'].join(' ')}
                  >
                    Player vs Player
                  </button>
                  <button
                    onClick={() => setMode('CPU')}
                    disabled={mode === 'CPU'}
                    className={['px-4 py-2.5 text-sm font-semibold', mode === 'CPU' ? 'bg-violet-500 text-white' : 'bg-white/5 hover:bg-white/10'].join(' ')}
                  >
                    Player vs CPU
                  </button>
                </div>
                <p className="mt-2 text-xs text-white/60">Switch anytime. (Round continues with current state.)</p>
              </div>

              <div className={mode === 'CPU' ? 'opacity-100' : 'opacity-50 pointer-events-none'}>
                <div className="mb-2 text-sm font-medium text-white/80">Your Mark</div>
                <div className="inline-grid grid-cols-2 overflow-hidden rounded-2xl border border-white/10">
                  <button
                    onClick={() => setUserPlays('X')}
                    disabled={userPlays === 'X' || hasMoves}
                    title={hasMoves ? 'Reset round to change' : ''}
                    className={['px-4 py-2.5 text-sm font-semibold', userPlays === 'X' ? 'bg-teal-500 text-white' : 'bg-white/5 hover:bg-white/10', hasMoves && userPlays !== 'X' ? 'cursor-not-allowed' : ''].join(' ')}
                  >
                    X (First)
                  </button>
                  <button
                    onClick={() => setUserPlays('O')}
                    disabled={userPlays === 'O' || hasMoves}
                    title={hasMoves ? 'Reset round to change' : ''}
                    className={['px-4 py-2.5 text-sm font-semibold', userPlays === 'O' ? 'bg-teal-500 text-white' : 'bg-white/5 hover:bg-white/10', hasMoves && userPlays !== 'O' ? 'cursor-not-allowed' : ''].join(' ')}
                  >
                    O (Second)
                  </button>
                </div>
                <p className="mt-2 text-xs text-white/60">When you choose O, CPU plays first as X.</p>
              </div>

              <div className="mt-6 rounded-2xl border border-white/10 bg-black/20 p-4 text-xs text-white/60">
                <p className="mb-1 font-semibold text-white/70">Tips</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Tap a square to place your mark.</li>
                  <li>Winning line glows green.</li>
                  <li>Use Reset Round to start a new game; Reset Scores clears the tally.</li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-10 text-center text-xs text-white/50">
          Built with <span className="text-violet-300">React</span> + <span className="text-teal-300">Tailwind</span> · No backend required
        </footer>
      </div>
    </div>
  )
}
