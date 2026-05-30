import type { Metadata, Viewport } from "next";
import "./globals.css";
import { PlayerProvider } from "@/lib/player-context";
import Shell from "@/components/shell";

export const metadata: Metadata = {
  title: "PrivatePlayer",
  description: "Your personal music library",
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#0d0d0d",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PlayerProvider>
          <Shell>{children}</Shell>
        </PlayerProvider>
      </body>
    </html>
  );
}
