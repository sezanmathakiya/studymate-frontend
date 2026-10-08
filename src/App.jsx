import { Link, Navigate, NavLink, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Home from "./components/Home";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import Subjects from "./components/Subjects";
import Tasks from "./components/Tasks";
import Progress from "./components/Progress";
import FileUpload from "./components/FileUpload";

const navItems = [
  { to: "/dashboard", label: "Overview", icon: "⌂" },
  { to: "/subjects", label: "Subjects", icon: "▤" },
  { to: "/tasks", label: "Tasks", icon: "✓" },
  { to: "/progress", label: "Progress", icon: "↗" },
  { to: "/files", label: "Study files", icon: "▧" },
];

function ProtectedRoute({ children }) {
  return localStorage.getItem("token") ? children : <Navigate to="/login" replace />;
}

function Workspace({ children }) {
  const navigate = useNavigate();
  const location = useLocation();
  const active = navItems.find((item) => item.to === location.pathname);
  const logout = () => {
    localStorage.removeItem("token");
    navigate("/login", { replace: true });
  };

  return (
    <div className="workspace">
      <aside className="sidebar">
        <Link to="/dashboard" className="brand-lockup">
          <span className="brand-mark">S</span>
          <span><strong>Study<span className="brand-accent">Mate</span></strong><small>LEARN • PLAN • GROW</small></span>
        </Link>
        <div className="nav-caption">WORKSPACE</div>
        <nav className="side-nav" aria-label="Main navigation">
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={({ isActive }) => `side-link${isActive ? " active" : ""}`}>
              <span className="nav-icon">{item.icon}</span><span>{item.label}</span>
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><span className="note-dot" />Your learning space<br/><small>One step at a time.</small></div>
          <button className="logout-button" onClick={logout}><span>↪</span> Sign out</button>
        </div>
      </aside>
      <div className="workspace-main">
        <header className="topbar">
          <div><span className="topbar-eyebrow">STUDYMATE / WORKSPACE</span><strong>{active?.label || "Workspace"}</strong></div>
          <div className="topbar-profile"><span className="avatar">S</span><span><b>Sezan</b><small>Student</small></span></div>
        </header>
        <main className="page-content">{children}</main>
        <footer className="app-footer">Made with care · <strong>Developed by Sezan Mathakiya</strong></footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<ProtectedRoute><Workspace><Dashboard /></Workspace></ProtectedRoute>} />
      <Route path="/subjects" element={<ProtectedRoute><Workspace><Subjects /></Workspace></ProtectedRoute>} />
      <Route path="/tasks" element={<ProtectedRoute><Workspace><Tasks /></Workspace></ProtectedRoute>} />
      <Route path="/progress" element={<ProtectedRoute><Workspace><Progress /></Workspace></ProtectedRoute>} />
      <Route path="/files" element={<ProtectedRoute><Workspace><FileUpload /></Workspace></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
export default App;
