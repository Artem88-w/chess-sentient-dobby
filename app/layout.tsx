import "./globals.css";
import Image from "next/image";
import { ReactNode } from "react";

export const metadata = {
  title: "Sentient Chess with Dobby",
  description: "Play chess against the aggressive AI mascot Dobby",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-black">
        <div className="relative min-h-screen">
          <Image
            src="/images/sentient-logo.png"
            alt="SentientAGI Logo"
            width={1000}
            height={1000}
            className="absolute -top-7 -left-45"
            priority
          />

          {children}
            <div className="absolute bottom-4 right-4">
           <span className="text-2xl font-bold bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCB045] bg-clip-text text-transparent">
            by Dirty Squirrel
           </span>
         </div>
        </div>
      </body>
    </html>
  );
}