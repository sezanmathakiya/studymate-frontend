
import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-blue-950 to-indigo-950 text-white">
      {/* Navbar */}
      <nav className="relative z-10 mx-auto flex max-w-7xl items-center justify-between px-6 py-5 lg:px-10">
        <Link to="/" className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-600 text-2xl font-black shadow-lg shadow-blue-500/30">
            S
          </div>
          <div>
            <h1 className="text-2xl font-extrabold tracking-wide">
              Study<span className="text-cyan-400">Mate</span>
            </h1>
            <p className="text-xs tracking-widest text-blue-200">
              SMART STUDY. BETTER FUTURE.
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link
            to="/login"
            className="rounded-xl border border-blue-300/30 px-4 py-2.5 text-sm font-semibold transition hover:bg-white/10"
          >
            Login
          </Link>
          <Link
            to="/signup"
            className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:scale-105"
          >
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <main className="relative mx-auto flex min-h-[75vh] max-w-7xl flex-col items-center justify-center px-6 py-16 text-center">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute left-0 top-20 h-64 w-64 rounded-full bg-blue-500/20 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-10 right-0 h-72 w-72 rounded-full bg-purple-500/20 blur-[100px]" />

        <div className="relative z-10 max-w-4xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-5 py-2 text-sm font-medium text-cyan-200">
            <span className="h-2 w-2 rounded-full bg-cyan-400" />
            Your personal study companion
          </div>

          <h2 className="text-5xl font-black leading-tight tracking-tight sm:text-6xl lg:text-7xl">
            Study Smarter,
            <span className="block bg-gradient-to-r from-cyan-300 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Achieve More.
            </span>
          </h2>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-blue-100/75 sm:text-lg">
            Organize your subjects, manage your daily tasks,
            track your progress, and take control of your
            learning journey with StudyMate.
          </p>

          <div className="mt-10 flex flex-wrap justify-center gap-4">
            <Link
              to="/signup"
              className="rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-8 py-4 font-bold text-white shadow-xl shadow-blue-500/30 transition hover:-translate-y-1 hover:shadow-blue-500/50"
            >
              Start Learning →
            </Link>
            <Link
              to="/login"
              className="rounded-xl border border-white/20 bg-white/5 px-8 py-4 font-semibold text-white backdrop-blur transition hover:-translate-y-1 hover:bg-white/10"
            >
              Login to Account
            </Link>
          </div>
        </div>

        {/* Feature cards */}
        <div className="relative z-10 mt-20 grid w-full max-w-5xl gap-5 sm:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-left shadow-xl backdrop-blur-lg transition hover:-translate-y-1 hover:border-cyan-300/40">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/20 text-2xl">
              📚
            </div>
            <h3 className="text-lg font-bold">Subject Management</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100/65">
              Keep all your subjects organized in one place.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-left shadow-xl backdrop-blur-lg transition hover:-translate-y-1 hover:border-purple-300/40">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/20 text-2xl">
              📝
            </div>
            <h3 className="text-lg font-bold">Task Management</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100/65">
              Plan assignments, set deadlines, and manage tasks.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.06] p-6 text-left shadow-xl backdrop-blur-lg transition hover:-translate-y-1 hover:border-green-300/40">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/20 text-2xl">
              📊
            </div>
            <h3 className="text-lg font-bold">Track Progress</h3>
            <p className="mt-2 text-sm leading-6 text-blue-100/65">
              Monitor your study progress and stay focused.
            </p>
          </div>
        </div>
      </main>

      {/* Contact and footer */}
      <footer id="contact" className="relative z-10 border-t border-white/10 bg-slate-950/40 px-6 py-10">
        <div className="mx-auto grid max-w-5xl gap-6 text-center sm:grid-cols-2 sm:text-left">
          <div>
            <p className="text-xs font-bold uppercase tracking-[.22em] text-cyan-300">Contact</p>
            <h2 className="mt-2 text-xl font-bold text-white">Let’s connect</h2>
            <p className="mt-1 text-sm text-blue-100/60">Questions or feedback? Reach out.</p>
          </div>
          <div className="flex flex-col items-center gap-3 text-sm text-blue-100 sm:items-start sm:justify-center">
            <a className="inline-flex items-center gap-3 hover:text-cyan-300" href="tel:6351268815"><span aria-hidden="true">☎</span><span>6351268815</span></a>
            <a className="inline-flex items-center gap-3 hover:text-cyan-300" href="mailto:sezanmathakiya70@gmail.com"><span aria-hidden="true">✉</span><span>sezanmathakiya70@gmail.com</span></a>
          </div>
        </div>
        <div className="mx-auto mt-8 max-w-5xl border-t border-white/10 pt-5 text-center">
          <p className="text-xs text-blue-100/50">© {new Date().getFullYear()} StudyMate. All rights reserved.</p>
          <p className="mt-2 text-sm font-semibold text-cyan-300">Designed & Developed by Sezan Mathakiya</p>
        </div>
      </footer>
    </div>
  );
}

export default Home;