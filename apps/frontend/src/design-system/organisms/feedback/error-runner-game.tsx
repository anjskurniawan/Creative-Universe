"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type GameStatus = "ready" | "playing" | "game-over";

export function ErrorRunnerGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const statusRef = useRef<GameStatus>("ready");
  const jumpRef = useRef<(() => void) | null>(null);
  const [status, setStatus] = useState<GameStatus>("ready");
  const [score, setScore] = useState(0);

  const startOrJump = useCallback(() => {
    if (statusRef.current === "game-over") {
      statusRef.current = "ready";
      setStatus("ready");
      setScore(0);
    }
    jumpRef.current?.();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const context = canvas.getContext("2d");
    if (!context) return;

    let frameId = 0;
    let lastTime = performance.now();
    let elapsed = 0;
    let scoreValue = 0;
    let displayedScore = 0;
    let nextObstacleAt = 900;
    const runner = { x: 48, y: 0, width: 32, height: 42, velocityY: 0 };
    let obstacles: Array<{ x: number; width: number; height: number }> = [];

    const resize = () => {
      const ratio = window.devicePixelRatio || 1;
      const width = Math.max(280, canvas.clientWidth);
      const height = 220;
      canvas.width = width * ratio;
      canvas.height = height * ratio;
      context.setTransform(ratio, 0, 0, ratio, 0, 0);
      runner.y = Math.min(runner.y || height - 62, height - 62);
    };

    const jump = () => {
      if (statusRef.current === "ready") {
        statusRef.current = "playing";
        setStatus("playing");
        elapsed = 0;
        scoreValue = 0;
        nextObstacleAt = 900;
        obstacles = [];
      }
      if (statusRef.current === "playing" && runner.y >= 157) runner.velocityY = -620;
    };
    jumpRef.current = jump;

    const drawRunner = () => {
      context.fillStyle = "#24252b";
      context.fillRect(runner.x + 5, runner.y + 4, 22, 26);
      context.fillRect(runner.x + 20, runner.y, 12, 15);
      context.fillRect(runner.x, runner.y + 20, 12, 8);
      context.fillRect(runner.x + 8, runner.y + 30, 6, 12);
      context.fillRect(runner.x + 23, runner.y + 30, 6, 12);
      context.fillStyle = "#ffffff";
      context.fillRect(runner.x + 26, runner.y + 4, 3, 3);
    };

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.034);
      lastTime = time;
      const width = canvas.clientWidth;
      const height = 220;
      const ground = height - 20;
      context.clearRect(0, 0, width, height);
      context.strokeStyle = "rgba(17,18,23,.24)";
      context.lineWidth = 1;
      context.beginPath(); context.moveTo(0, ground); context.lineTo(width, ground); context.stroke();

      if (statusRef.current === "playing") {
        elapsed += delta * 1000;
        scoreValue += delta * 10;
        runner.velocityY += 1800 * delta;
        runner.y = Math.min(ground - runner.height, runner.y + runner.velocityY * delta);
        if (runner.y >= ground - runner.height) runner.velocityY = 0;
        if (elapsed >= nextObstacleAt) {
          obstacles.push({ x: width + 20, width: 16 + Math.random() * 12, height: 28 + Math.random() * 28 });
          nextObstacleAt += 950 + Math.random() * 900;
        }
        obstacles.forEach((obstacle) => { obstacle.x -= (260 + Math.min(scoreValue, 160)) * delta; });
        obstacles = obstacles.filter((obstacle) => obstacle.x + obstacle.width > 0);
        const hit = obstacles.some((obstacle) => runner.x + runner.width - 4 > obstacle.x && runner.x + 4 < obstacle.x + obstacle.width && runner.y + runner.height > ground - obstacle.height);
        if (hit) { statusRef.current = "game-over"; setStatus("game-over"); }
        const nextDisplayedScore = Math.floor(scoreValue);
        if (nextDisplayedScore !== displayedScore) {
          displayedScore = nextDisplayedScore;
          setScore(nextDisplayedScore);
        }
      } else if (!runner.y) runner.y = ground - runner.height;

      context.fillStyle = "#ba0dcb";
      obstacles.forEach((obstacle) => context.fillRect(obstacle.x, ground - obstacle.height, obstacle.width, obstacle.height));
      drawRunner();
      frameId = window.requestAnimationFrame(render);
    };

    const handleKey = (event: KeyboardEvent) => {
      if (["Space", "ArrowUp"].includes(event.code)) { event.preventDefault(); startOrJump(); }
    };
    resize();
    window.addEventListener("keydown", handleKey);
    const observer = new ResizeObserver(resize);
    observer.observe(canvas);
    frameId = window.requestAnimationFrame(render);
    return () => { window.cancelAnimationFrame(frameId); window.removeEventListener("keydown", handleKey); observer.disconnect(); jumpRef.current = null; };
  }, [startOrJump]);

  return <section className="w-full max-w-3xl" aria-label="Permainan runner"><div className="mb-3 flex items-center justify-between text-xs font-medium uppercase tracking-[0.12em] text-[#6f7078]"><span>{status === "game-over" ? "Game over" : status === "playing" ? "Running" : "Ready"}</span><span>Score {String(score).padStart(4, "0")}</span></div><button type="button" onClick={startOrJump} className="block w-full cursor-pointer overflow-hidden rounded-2xl border border-black/10 bg-[#f5f5f7] text-left shadow-sm focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ba0dcb]" aria-label={status === "game-over" ? "Mulai ulang permainan" : "Lompat"}><canvas ref={canvasRef} className="block h-[220px] w-full" /><span className="block border-t border-black/10 px-4 py-3 text-center text-xs text-[#6f7078]">{status === "game-over" ? "Tekan untuk main lagi" : "Tekan Space, Arrow Up, atau area game untuk melompat"}</span></button></section>;
}
