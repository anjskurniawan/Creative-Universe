"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const BOARD_WIDTH = 10;
const BOARD_HEIGHT = 18;
const CELL_SIZE = 18;

const TETROMINOES = {
  I: { color: "#23a7c5", matrix: [[1, 1, 1, 1]] },
  J: { color: "#4056b5", matrix: [[1, 0, 0], [1, 1, 1]] },
  L: { color: "#ed8b2c", matrix: [[0, 0, 1], [1, 1, 1]] },
  O: { color: "#e8bd28", matrix: [[1, 1], [1, 1]] },
  S: { color: "#50a85b", matrix: [[0, 1, 1], [1, 1, 0]] },
  T: { color: "#a541a8", matrix: [[0, 1, 0], [1, 1, 1]] },
  Z: { color: "#d84a4a", matrix: [[1, 1, 0], [0, 1, 1]] },
} as const;

type TetrominoName = keyof typeof TETROMINOES;
type Board = Array<Array<TetrominoName | null>>;
type Matrix = number[][];
type GameStatus = "ready" | "playing" | "game-over";
type GameAction = "start" | "left" | "right" | "down" | "rotate" | "drop";

interface Piece {
  name: TetrominoName;
  matrix: Matrix;
  x: number;
  y: number;
}

const createBoard = (): Board => Array.from({ length: BOARD_HEIGHT }, () => Array<TetrominoName | null>(BOARD_WIDTH).fill(null));

const rotateMatrix = (matrix: Matrix): Matrix => matrix[0].map((_, column) => matrix.map((row) => row[column]).reverse());

const createPiece = (name: TetrominoName): Piece => {
  const matrix = TETROMINOES[name].matrix.map((row) => [...row]);
  return { name, matrix, x: Math.floor((BOARD_WIDTH - matrix[0].length) / 2), y: 0 };
};

const collides = (board: Board, piece: Piece, offsetX = 0, offsetY = 0, matrix = piece.matrix) => matrix.some((row, y) => row.some((cell, x) => {
  if (!cell) return false;
  const boardX = piece.x + x + offsetX;
  const boardY = piece.y + y + offsetY;
  return boardX < 0 || boardX >= BOARD_WIDTH || boardY >= BOARD_HEIGHT || (boardY >= 0 && board[boardY][boardX] !== null);
}));

const MiniPiece = ({ name }: { name: TetrominoName }) => {
  const matrix = TETROMINOES[name].matrix;
  return (
    <div className="grid size-16 grid-cols-4 grid-rows-4 gap-0.5 rounded-lg border-2 border-[#24252b] bg-[#dfe2d3] p-1.5" aria-hidden="true">
      {Array.from({ length: 16 }, (_, index) => {
        const row = Math.floor(index / 4);
        const column = index % 4;
        const offsetX = Math.floor((4 - matrix[0].length) / 2);
        const offsetY = Math.floor((4 - matrix.length) / 2);
        const filled = matrix[row - offsetY]?.[column - offsetX];
        return <span key={index} className="rounded-[2px] border border-black/10" style={{ backgroundColor: filled ? TETROMINOES[name].color : "transparent" }} />;
      })}
    </div>
  );
};

export function ErrorTetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const gameRef = useRef<HTMLElement>(null);
  const statusRef = useRef<GameStatus>("ready");
  const actionRef = useRef<(action: GameAction) => void>(() => undefined);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [nextPiece, setNextPiece] = useState<TetrominoName>("T");

  const act = useCallback((action: GameAction) => {
    actionRef.current(action);
    gameRef.current?.focus({ preventScroll: true });
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;

    let frameId = 0;
    let lastTime = performance.now();
    let dropElapsed = 0;
    let board = createBoard();
    let bag: TetrominoName[] = [];
    let piece = createPiece("T");
    let queuedPiece: TetrominoName = "T";
    let scoreValue = 0;
    let lineValue = 0;
    let levelValue = 1;

    const takeFromBag = () => {
      if (!bag.length) {
        bag = (Object.keys(TETROMINOES) as TetrominoName[])
          .map((name) => ({ name, order: Math.random() }))
          .sort((a, b) => a.order - b.order)
          .map(({ name }) => name);
      }
      return bag.pop() as TetrominoName;
    };

    const updateStats = () => {
      setScore(scoreValue);
      setLines(lineValue);
      setLevel(levelValue);
    };

    const startGame = () => {
      board = createBoard();
      bag = [];
      scoreValue = 0;
      lineValue = 0;
      levelValue = 1;
      dropElapsed = 0;
      piece = createPiece(takeFromBag());
      queuedPiece = takeFromBag();
      setNextPiece(queuedPiece);
      updateStats();
      statusRef.current = "playing";
      setStatus("playing");
    };

    const finishGame = () => {
      statusRef.current = "game-over";
      setStatus("game-over");
    };

    const spawnPiece = () => {
      piece = createPiece(queuedPiece);
      queuedPiece = takeFromBag();
      setNextPiece(queuedPiece);
      if (collides(board, piece)) finishGame();
    };

    const lockPiece = () => {
      const nextBoard = board.map((row) => [...row]);
      piece.matrix.forEach((row, y) => row.forEach((cell, x) => {
        const boardY = piece.y + y;
        if (cell && boardY >= 0) nextBoard[boardY][piece.x + x] = piece.name;
      }));

      const remaining = nextBoard.filter((row) => row.some((cell) => cell === null));
      const cleared = BOARD_HEIGHT - remaining.length;
      board = [...Array.from({ length: cleared }, () => Array<TetrominoName | null>(BOARD_WIDTH).fill(null)), ...remaining];
      if (cleared) {
        lineValue += cleared;
        scoreValue += [0, 100, 300, 500, 800][cleared] * levelValue;
        levelValue = Math.floor(lineValue / 10) + 1;
        updateStats();
      }
      spawnPiece();
    };

    const moveDown = (reward = false) => {
      if (!collides(board, piece, 0, 1)) {
        piece.y += 1;
        if (reward) {
          scoreValue += 1;
          setScore(scoreValue);
        }
        return true;
      }
      lockPiece();
      return false;
    };

    const performAction = (action: GameAction) => {
      if (action === "start" || statusRef.current !== "playing") {
        if (statusRef.current !== "playing") startGame();
        if (action === "start") return;
      }

      if (action === "left" && !collides(board, piece, -1)) piece.x -= 1;
      if (action === "right" && !collides(board, piece, 1)) piece.x += 1;
      if (action === "down") moveDown(true);
      if (action === "rotate") {
        const rotated = rotateMatrix(piece.matrix);
        const kick = [0, -1, 1, -2, 2].find((offset) => !collides(board, piece, offset, 0, rotated));
        if (kick !== undefined) {
          piece.x += kick;
          piece.matrix = rotated;
        }
      }
      if (action === "drop") {
        let distance = 0;
        while (!collides(board, piece, 0, 1)) {
          piece.y += 1;
          distance += 1;
        }
        scoreValue += distance * 2;
        setScore(scoreValue);
        lockPiece();
      }
      dropElapsed = 0;
    };
    actionRef.current = performAction;

    const drawCell = (x: number, y: number, color: string, alpha = 1) => {
      context.globalAlpha = alpha;
      context.fillStyle = color;
      context.fillRect(x * CELL_SIZE + 1, y * CELL_SIZE + 1, CELL_SIZE - 2, CELL_SIZE - 2);
      context.fillStyle = "rgba(255,255,255,.32)";
      context.fillRect(x * CELL_SIZE + 3, y * CELL_SIZE + 3, CELL_SIZE - 6, 2);
      context.strokeStyle = "rgba(22,24,25,.38)";
      context.strokeRect(x * CELL_SIZE + 1.5, y * CELL_SIZE + 1.5, CELL_SIZE - 3, CELL_SIZE - 3);
      context.globalAlpha = 1;
    };

    const draw = () => {
      context.fillStyle = "#dfe2d3";
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.strokeStyle = "rgba(36,37,43,.08)";
      context.lineWidth = 1;
      for (let x = 1; x < BOARD_WIDTH; x += 1) {
        context.beginPath(); context.moveTo(x * CELL_SIZE, 0); context.lineTo(x * CELL_SIZE, canvas.height); context.stroke();
      }
      for (let y = 1; y < BOARD_HEIGHT; y += 1) {
        context.beginPath(); context.moveTo(0, y * CELL_SIZE); context.lineTo(canvas.width, y * CELL_SIZE); context.stroke();
      }
      board.forEach((row, y) => row.forEach((name, x) => {
        if (name) drawCell(x, y, TETROMINOES[name].color);
      }));

      if (statusRef.current === "playing") {
        let ghostY = piece.y;
        while (!collides(board, { ...piece, y: ghostY }, 0, 1)) ghostY += 1;
        piece.matrix.forEach((row, y) => row.forEach((cell, x) => {
          if (cell) drawCell(piece.x + x, ghostY + y, TETROMINOES[piece.name].color, 0.22);
        }));
      }
      piece.matrix.forEach((row, y) => row.forEach((cell, x) => {
        if (cell) drawCell(piece.x + x, piece.y + y, TETROMINOES[piece.name].color);
      }));
    };

    const render = (time: number) => {
      const delta = Math.min(time - lastTime, 50);
      lastTime = time;
      if (statusRef.current === "playing") {
        dropElapsed += delta;
        const dropInterval = Math.max(110, 720 - (levelValue - 1) * 60);
        if (dropElapsed >= dropInterval) {
          moveDown();
          dropElapsed = 0;
        }
      }
      draw();
      frameId = window.requestAnimationFrame(render);
    };

    draw();
    frameId = window.requestAnimationFrame(render);
    return () => {
      window.cancelAnimationFrame(frameId);
      actionRef.current = () => undefined;
    };
  }, []);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    const controls: Partial<Record<string, GameAction>> = {
      ArrowLeft: "left",
      ArrowRight: "right",
      ArrowDown: "down",
      ArrowUp: "rotate",
      Enter: "start",
      " ": "drop",
    };
    const action = controls[event.key];
    if (!action) return;
    event.preventDefault();
    act(action);
  };

  const statusLabel = status === "game-over" ? "Game over" : status === "playing" ? "Playing" : "Ready";

  return (
    <section
      ref={gameRef}
      tabIndex={0}
      onKeyDown={handleKeyDown}
      className="w-full max-w-xl rounded-[28px] border-2 border-[#24252b] bg-[#c9ccc0] p-3 shadow-[0_8px_0_#24252b] outline-none focus-visible:ring-4 focus-visible:ring-[#ba0dcb]/30 md:p-5"
      aria-label="Permainan Tetris"
    >
      <div className="mb-3 flex items-center justify-between font-mono text-[11px] font-bold uppercase tracking-[0.16em] text-[#24252b]">
        <span>{statusLabel}</span>
        <span>Tetris / Creative Universe</span>
      </div>

      <div className="flex items-start justify-center gap-3 md:gap-5">
        <button
          type="button"
          onClick={() => act(status === "playing" ? "rotate" : "start")}
          className="relative shrink overflow-hidden rounded-lg border-[3px] border-[#24252b] bg-[#dfe2d3] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ba0dcb]"
          aria-label={status === "playing" ? "Putar balok" : "Mulai permainan Tetris"}
        >
          <canvas ref={canvasRef} width={BOARD_WIDTH * CELL_SIZE} height={BOARD_HEIGHT * CELL_SIZE} className="block h-auto w-full max-w-[180px] [image-rendering:pixelated]" />
          {status !== "playing" && (
            <span className="absolute inset-0 flex items-center justify-center bg-[#dfe2d3]/80 px-4 text-center font-mono text-sm font-black uppercase tracking-[0.12em] text-[#24252b]">
              {status === "game-over" ? "Game over\nKlik untuk ulang" : "Klik untuk mulai"}
            </span>
          )}
        </button>

        <aside className="flex w-[92px] shrink-0 flex-col gap-2 font-mono text-[#24252b] md:w-[116px] md:gap-3">
          <Stat label="Score" value={String(score).padStart(5, "0")} />
          <Stat label="Level" value={String(level).padStart(2, "0")} />
          <Stat label="Lines" value={String(lines).padStart(2, "0")} />
          <div className="rounded-lg border-2 border-[#24252b] bg-[#eceee6] p-2 shadow-[inset_0_0_0_2px_#c9ccc0]">
            <p className="mb-1 text-center text-[9px] font-black uppercase tracking-[0.14em]">Next</p>
            <div className="flex justify-center"><MiniPiece name={nextPiece} /></div>
          </div>
        </aside>
      </div>

      <div className="mt-4 grid grid-cols-5 gap-2" aria-label="Kontrol sentuh">
        <Control label="Geser ke kiri" symbol="←" onClick={() => act("left")} />
        <Control label="Turunkan" symbol="↓" onClick={() => act("down")} />
        <Control label="Putar" symbol="↻" onClick={() => act("rotate")} />
        <Control label="Geser ke kanan" symbol="→" onClick={() => act("right")} />
        <Control label="Jatuhkan" symbol="⇣" onClick={() => act("drop")} />
      </div>
      <p className="mt-3 text-center font-mono text-[10px] font-bold uppercase tracking-[0.08em] text-[#4f514c]">
        Arrow untuk gerak · Arrow Up putar · Space jatuhkan
      </p>
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border-2 border-[#24252b] bg-[#eceee6] px-2 py-1.5 text-right shadow-[inset_0_0_0_2px_#c9ccc0]">
      <p className="text-[8px] font-black uppercase tracking-[0.14em] md:text-[9px]">{label}</p>
      <p className="text-base font-black leading-none md:text-lg">{value}</p>
    </div>
  );
}

function Control({ label, symbol, onClick }: { label: string; symbol: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="rounded-lg border-2 border-[#24252b] bg-[#eceee6] py-2 font-mono text-lg font-black leading-none text-[#24252b] shadow-[0_3px_0_#24252b] transition-transform active:translate-y-0.5 active:shadow-[0_1px_0_#24252b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ba0dcb]"
    >
      {symbol}
    </button>
  );
}
