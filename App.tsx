import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Logo from "./Logo";
import SecurityVisual from "./SecurityVisual";
import ContactForm from "./components/ContactForm";

export default function App({ onNavigateToAnalyze }: { onNavigateToAnalyze?: () => void }) {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const { user, userData, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="bg-black text-white min-h-screen">
      <style>{`
        @keyframes shine {
          0% { background-position: 0% 50%; }
          100% { background-position: 200% 50%; }
        }
      `}</style>

      {/* NAV */}
      <nav className="flex justify-between items-center px-10 py-6">
        <Logo />
        <div className="flex gap-4 items-center">
          {user ? (
            <>
              <span className="text-sm text-gray-400">
                {userData?.email}
              </span>
              <button 
                onClick={handleLogout}
                className="px-4 py-2 rounded-full border border-red-500/50 text-red-400 hover:bg-red-500/10 transition-colors text-sm"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-full border border-white/40 text-sm hover:border-white/60 transition-colors"
              >
                Login
              </button>
              <button 
                onClick={() => navigate('/login')}
                className="px-4 py-2 rounded-full bg-[#BDE038] text-black font-semibold text-sm hover:bg-[#a8c932] transition-colors"
              >
                Sign Up
              </button>
            </>
          )}
        </div>
      </nav>

      {/* HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        <SecurityVisual />

        <div className="max-w-3xl space-y-6 z-10 ml-[-24%]">
          <span className="text-lg tracking-widest uppercase font-semibold bg-gradient-to-r from-[#BDE038] via-white to-[#BDE038] bg-[length:200%_100%] bg-clip-text text-transparent animate-[shine_3s_linear_infinite] drop-shadow-[0_0_12px_rgba(189,224,56,0.35)]">
            Breachless
          </span>

          <h1 className="text-5xl font-bold leading-tight">
            Awareness before compromise.
          </h1>

          <p className="text-lg text-gray-300 leading-relaxed max-w-2xl">
            Exposed secrets are the #1 entry point for attackers. Paste your code or <code className="bg-white/10 px-1.5 py-0.5 rounded">.env</code> file below to simulate exposure analysis.
          </p>

          <textarea
            className="w-full max-w-2xl h-44 p-4 rounded-xl bg-[#121212] border border-white/30 text-sm focus:border-[#BDE038] focus:outline-none transition-colors resize-none"
            placeholder={`AWS_SECRET_ACCESS_KEY=...
DATABASE_URL=...
STRIPE_SECRET_KEY=...`}
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />

          <button
            onClick={onNavigateToAnalyze}
            className="group flex items-center gap-3 px-6 py-3.5 rounded-full bg-gradient-to-r from-[#10454F] to-[#BDE038] text-black text-base font-semibold hover:shadow-lg hover:shadow-[#BDE038]/30 transition-all"
          >
            <span className="w-8 h-8 rounded-full bg-black/20 flex items-center justify-center group-hover:bg-black/30 transition-colors text-base">
              →
            </span>
            Analyze Exposure
          </button>
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-16 px-10">
        <h2 className="text-[1.65rem] font-bold text-center mb-10">
          Pre-Commit Awareness Loop
        </h2>

        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {[
            {
              title: "Detect",
              desc: "Real-time scanning of your diffs.",
              extraLine: "Catch secrets before they hit your repository.",
              icon: "🔍",
              color: "from-[#BDE038]/20 to-[#BDE038]/5",
              accent: "#BDE038",
            },
            {
              title: "Alert",
              desc: "Immediate feedback before leaks happen.",
              extraLine: "Get notified instantly with actionable insights.",
              icon: "⚡",
              color: "from-yellow-400/20 to-yellow-400/5",
              accent: "#facc15",
            },
            {
              title: "Protect",
              desc: "Block commits with exposed secrets.",
              extraLine: "Automated prevention at the source control level.",
              icon: "🛡️",
              color: "from-emerald-400/20 to-emerald-400/5",
              accent: "#34d399",
            },
          ].map(({ title, desc, extraLine, icon, color, accent }) => (
            <div
              key={title}
              className="relative bg-[#121212] border border-white/25 rounded-2xl p-6 transition-all duration-500 group overflow-hidden hover:-translate-y-2 hover:shadow-xl"
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />

              <div className="relative z-10">
                <div className="text-[2.65rem] mb-4 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-3">
                  {icon}
                </div>

                <h3 className="text-[1.15rem] font-semibold mb-2 group-hover:text-[#BDE038] transition-colors">
                  {title}
                </h3>

                <p className="text-[0.95rem] text-gray-400 mb-1">{desc}</p>
                <p className="text-[0.82rem] text-gray-500">{extraLine}</p>
              </div>

              <div
                className="absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500"
                style={{ backgroundColor: accent }}
              />
            </div>
          ))}
        </div>
      </section>

      {/* CONTACT FORM */}
      <ContactForm />
    </div>
  );
}