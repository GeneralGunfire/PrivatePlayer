import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/lib/player-context";
import Shell from "@/components/shell";

export const metadata: Metadata = {
  title: "PrivatePlayer",
  description: "Your personal music library",
  icons: { icon: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🎵</text></svg>" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#0a0a0a] text-white antialiased">
        <PlayerProvider>
          <Shell>{children}</Shell>
        </PlayerProvider>
      </body>
    </html>
  );
}
