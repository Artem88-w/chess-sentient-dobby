"use client";

import dynamic from "next/dynamic";

const ChessBoard = dynamic(
  () => import("../components/ChessBoard"),
  { ssr: false }
);

export default function Page() {
  return (
    <main
      className="flex items-center justify-center h-screen bg-cover bg-center"
      style={{ backgroundImage: "url('/images/texture.svg')" }}
    >
      <ChessBoard />
    </main>
  );
}