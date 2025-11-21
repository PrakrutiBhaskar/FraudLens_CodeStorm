import { Link, useLocation } from "react-router-dom";
import "../styles/matrix-theme.css";

export default function NavBar() {
  const { pathname } = useLocation();

  const linkClass = (path) =>
    `hacker-btn px-4 py-2 transition-all duration-200 ${
      pathname === path
        ? "bg-green-500/20 shadow-[0_0_15px_#00ff66] text-green-400"
        : "opacity-70 hover:opacity-100 hover:shadow-[0_0_10px_#00ff66]"
    }`;

  return (
    <div className="panel flex items-center justify-between mb-6 sticky top-0 z-50 backdrop-blur-lg bg-black/50 p-4">

      {/* Left: Logo/Title */}
      <div className="neon-text text-xl tracking-wider">
        ⚡ FraudLens
      </div>

      {/* Right: Nav Links */}
      <div className="flex gap-4 flex-wrap">
        <Link to="/" className={linkClass("/")}>
          HOME
        </Link>
        <Link to="/upload" className={linkClass("/upload")}>
          UPLOAD
        </Link>
        <Link to="/admin" className={linkClass("/admin")}>
          ADMIN
        </Link>
        <Link to="/history" className={linkClass("/history")}>
          HISTORY
        </Link>
        <Link to="/triage" className={linkClass("/triage")}>
          TRIAGE
        </Link>
        <Link to="/metrics" className={linkClass("/metrics")}>
          METRICS
        </Link>
        <Link to="/pdf" className={linkClass("/pdf")}>
          PDF
        </Link>
      </div>
    </div>
  );
}
