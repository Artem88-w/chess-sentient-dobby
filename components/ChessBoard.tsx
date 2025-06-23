"use client";

import { useRef, useState } from "react";
import { Chess } from "chess.js";
import { Chessboard } from "react-chessboard";
import Image from "next/image";

const dobbyComments = [
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

export default function ChessBoard() {
  const game = useRef(new Chess());
  const [position, setPosition] = useState(game.current.fen());
  const [comment, setComment] = useState("Let's begin!");
  const [showDobby, setShowDobby] = useState(false);

  function handlePlayerMove(from: string, to: string) {
    setShowDobby(false);
    const move = game.current.move({ from, to, promotion: "q" });
    if (!move) return false;
    setPosition(game.current.fen());

    if (game.current.isGameOver() && game.current.turn() === "b") {
     setComment("Fuck, how u did it?");
     setShowDobby(true);
     return true;
   }

    setTimeout(() => {
      const moves = game.current.moves({ verbose: true });
      if (moves.length > 0) {
        const rnd = moves[Math.floor(Math.random() * moves.length)];
        game.current.move(rnd.san);
        setPosition(game.current.fen());
        setComment(dobbyComments[Math.floor(Math.random() * dobbyComments.length)]);
      }
      setShowDobby(true);
    }, 300);

    return true;
  }

  return (
    <div
      className="relative inline-block flex flex-col items-center gap-6 p-6 rounded-2xl shadow-xl"
      style={{
        background:
          "linear-gradient(90deg, rgba(42,123,155,1) 0%, rgba(87,199,133,1) 50%, rgba(237,221,83,1) 100%)"
      }}
    >
      <div className="relative z-20">
        <Chessboard
          position={position}
          onPieceDrop={handlePlayerMove}
          boardWidth={500}
          customBoardStyle={{
            borderRadius: "8px",
            boxShadow: "0 3px 12px rgba(0,0,0,0.5)"
          }}
        />
      </div>

      {showDobby && (
        <>
          {/* Dobby під кутом 45° */}
          <div
            className="absolute top-1/2 right-[-60px] z-10 transform -translate-y-1/2 rotate-45"
            style={{ pointerEvents: "none", width: 120, height: 120 }}
          >
            <Image
              src="/dobby/dobby.png"
              alt="Dobby peeking"
              width={120}
              height={120}
              style={{ objectFit: "contain" }}
            />
          </div>

          {/* Бульбашка з коментарем, фіксовані координати */}
          <div
            className="absolute z-30 bg-black bg-opacity-75 text-white text-xs font-semibold px-2 py-2 rounded-lg whitespace-nowrap"
            style={{ top: 180, left: 580 }}
          >
            {comment}
            <div
              className="absolute"
              style={{
                bottom: -6,
                left: 10,
                width: 0,
                height: 0,
                borderLeft: "6px solid transparent",
                borderRight: "6px solid transparent",
                borderTop: "6px solid rgba(0,0,0,0.75)"
              }}
            />
          </div>
        </>
      )}
    </div>
  );
}