import "./globals.css";
import Navigation from "@/components/Navigation";

export const metadata = {
  title: "EcoPulse — Workforce Infrastructure",
  description:
    "AI-powered B2B2G workforce platform for verified blue-collar jobs, funded training, and employment outcomes.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-ink-900 antialiased">
        <Navigation />
        <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-10 text-xs text-slate-500">
          EcoPulse MVP demo · Rule-based matching model · Designed to evolve
          into ML-driven prediction as placement and retention data grows.
        </footer>
      </body>
    </html>
  );
}
