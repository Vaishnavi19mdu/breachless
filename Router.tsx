import { useState } from "react";
import App from "./App";
import AnalyzeExposure from "./analyze/AnalyzeExposure";

export default function Router() {
  const [currentPage, setCurrentPage] = useState<'home' | 'analyze'>('home');

  if (currentPage === 'analyze') {
    return (
      <div>
        {/* Back button */}
        <button
          onClick={() => setCurrentPage('home')}
          className="fixed top-6 left-6 z-50 px-6 py-3 rounded-full bg-[#121212] border border-white/30 text-white hover:border-[#BDE038] transition-colors flex items-center gap-2"
        >
          <span>←</span> Back to Home
        </button>
        <AnalyzeExposure />
      </div>
    );
  }

  return <App onNavigateToAnalyze={() => setCurrentPage('analyze')} />;
}