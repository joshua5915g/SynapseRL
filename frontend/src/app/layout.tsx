import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "SynapseRL | Autonomous B2B Content Engine",
  description: "Adversarial Multi-Agent Graph with Reinforcement Learning from Human Feedback (RLHF)",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen bg-[#060911] text-slate-100 font-sans antialiased flex flex-col relative selection:bg-indigo-500/30 selection:text-white">
        {/* Background Visual Layers */}
        <div className="fixed inset-0 pointer-events-none bg-grid-cyber opacity-70 z-0" />
        <div className="fixed inset-0 pointer-events-none bg-radial-ambient z-0" />

        <div className="relative z-10 flex flex-col min-h-screen">
          <Navbar />
          <div className="flex-1 max-w-7xl 2xl:max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </div>
          <footer className="border-t border-slate-900/80 bg-slate-950/40 backdrop-blur-md py-6 text-center text-xs text-slate-500 font-mono flex flex-col sm:flex-row items-center justify-between max-w-7xl 2xl:max-w-[1400px] w-full mx-auto px-4 sm:px-6 lg:px-8 gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
              <span>SynapseRL Core v1.2 • LangGraph Multi-Agent Runtime</span>
            </div>
            <div className="flex items-center gap-4 text-[11px] text-slate-500">
              <span>SQLite DPO Cache</span>
              <span>•</span>
              <span>HuggingFace TRL Ready</span>
              <span>•</span>
              <span>Gaussian Jitter Dispatch</span>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
