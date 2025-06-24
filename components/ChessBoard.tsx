"use client";

import { useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Image from "next/image";


type ChessGame = InstanceType<typeof Chess>;

type Piece = { type: string; color: "w" | "b" };


type Comment = string;
const dobbyComments: Comment[] = [
  "I'm the greatest grandmaster",
  "I've never been this sure of a win",
  "How’s it going? (I don’t care.)",
  "I’m reading you like an open book",
  "You’re stupid like ChatGpt",
  "Chess just isn’t your thing",
  "Cry more",
  "Thx, second",
  "Retarded?",
  "I'm tired of winning",
  "Boss is here",
  "U will lose"
];


const customPieces = Object.fromEntries(
  ["wP","wR","wN","wB","wQ","wK","bP","bR","bN","bB","bQ","bK"].map(
    (piece) => [
      piece,
      ({ squareWidth }: { squareWidth: number }) => (
        <img
          src={`/chesspieces/${piece}.png`}
          width={squareWidth}
          height={squareWidth}
          style={{ display: "block" }}
          alt={piece}
        />
      )
    ]
  )
);


function evaluateBoard(board: (Piece | null)[][]): number {
  const values: Record<string, number> = { p:1, n:3, b:3, r:5, q:9, k:0 };
  let score = 0;
  for (const rank of board) {
    for (const p of rank) {
      if (!p) continue;
      const v = values[p.type] || 0;
      score += p.color === "w" ? v : -v;
    }
  }
  return score;
}


function selectBestMove(game: ChessGame): { from: string; to: string } | null {
  const moves = game.moves({ verbose: true });
  if (moves.length === 0) return null;

  let bestVal = Infinity;
  const bestMoves: typeof moves = [];

  for (const m of moves) {
    game.move({ from: m.from, to: m.to, promotion: "q" });
    const val = evaluateBoard(game.board());
    game.undo();
    if (val < bestVal) {
      bestVal = val;
      bestMoves.length = 0;
      bestMoves.push(m);
    } else if (val === bestVal) {
      bestMoves.push(m);
    }
  }

  const choice = bestMoves[Math.floor(Math.random() * bestMoves.length)];
  return choice ? { from: choice.from, to: choice.to } : null;
}

export default function ChessBoard() {
  const game = useRef(new Chess());
  const [position, setPosition] = useState(game.current.fen());
  const [comment, setComment] = useState<Comment>("Let's begin!");
  const [showDobby, setShowDobby] = useState(false);
  const [isComputerThinking, setIsComputerThinking] = useState(false);

  function handlePlayerMove(from: string, to: string) {

    if (game.current.turn() !== "w" || isComputerThinking) return false;

    setShowDobby(false);
    const move = game.current.move({ from, to, promotion: "q" });
    if (!move) return false;

    setPosition(game.current.fen());
    setIsComputerThinking(true);


    if (game.current.isGameOver() && game.current.turn() === "b") {
      setComment("Fuck, how u did it?");
      setShowDobby(true);
      setIsComputerThinking(false);
      return true;
    }

    setTimeout(() => {

      const best = selectBestMove(game.current as ChessGame);
      const moveObj = best ?? (() => {
        const all = game.current.moves({ verbose: true });
        if (all.length === 0) return null;
        const rnd = all[Math.floor(Math.random() * all.length)];
        return { from: rnd.from, to: rnd.to };
      })();

      if (moveObj) {
        game.current.move({ from: moveObj.from, to: moveObj.to, promotion: "q" });
        setPosition(game.current.fen());
        setComment(dobbyComments[Math.floor(Math.random() * dobbyComments.length)]);
      }

      setShowDobby(true);
      setIsComputerThinking(false);
    }, 300);

    return true;
  }


  const turn = position.split(" ")[1]; 

  return (
    <div className="relative inline-block flex flex-col items-center gap-6 p-6 rounded-2xl shadow-xl" style={{ background: "linear-gradient(90deg, rgba(42,123,155,1) 0%, rgba(87,199,133,1) 50%, rgba(237,221,83,1) 100%)" }}>
      <div className="relative z-20">
        <Chessboard
          position={position}
          onPieceDrop={handlePlayerMove}
          boardWidth={500}
          arePiecesDraggable={!isComputerThinking && turn === "w"}
          customBoardStyle={{ borderRadius: "8px", boxShadow: "0 3px 12px rgba(0,0,0,0.5)" }}
          customPieces={customPieces}
        />
      </div>

      {showDobby && (
        <>
          <div className="absolute top-1/2 right-[-60px] z-10 transform -translate-y-1/2 rotate-45" style={{ pointerEvents: "none", width: 120, height: 120 }}>
            <Image src="/dobby/dobby.png" alt="Dobby peeking" width={120} height={120} style={{ objectFit: "contain" }} />
          </div>
          <div className="absolute z-30 bg-black bg-opacity-75 text-white text-xs font-semibold px-2 py-2 rounded-lg whitespace-nowrap" style={{ top: 180, left: 580 }}>
            {comment}
            <div className="absolute" style={{ bottom: -6, left: 10, width: 0, height: 0, borderLeft: "6px solid transparent", borderRight: "6px solid transparent", borderTop: "6px solid rgba(0,0,0,0.75)" }} />
          </div>
        </>
      )}
    </div>
  );
}