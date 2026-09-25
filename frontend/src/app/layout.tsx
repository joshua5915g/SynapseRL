import type { Metadata } from "next";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";

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
    <html lang="en" className="dark">
      <body className="min-h-screen bg-slate-950 text-slate-100 antialiased flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <footer className="border-t border-slate-900 py-6 text-center text-xs text-slate-600 font-mono">
          SynapseRL Engine v1.0.0 • LangGraph Multi-Agent Routing • SQLite DPO Buffer
        </footer>
      </body>
    </html>
  );
}
