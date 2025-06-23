// components/DobbyChat.tsx
import Image from "next/image";

type Props = { line: string };

export default function DobbyChat({ line }: Props) {
  return (
    <div className="relative max-w-xs bg-indigo-600 text-white p-4 rounded-xl shadow-lg">
      <div className="absolute -top-6 left-1/2 transform -translate-x-1/2">
        <Image
          src="/dobby/dobby.png"
          alt="Dobby"
          width={64}
          height={64}
          className="rounded-full border-2 border-white"
          priority
        />
      </div>
      <p className="mt-8 text-center font-semibold">{line}</p>
      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-indigo-600 rotate-45"></div>
    </div>
  );
}
