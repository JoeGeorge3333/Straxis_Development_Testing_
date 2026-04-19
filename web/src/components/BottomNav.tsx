import { NavLink } from "react-router-dom";

function linkClass({ isActive }: { isActive: boolean }) {
  return `bottomNavLink ${isActive ? "bottomNavLinkActive" : ""}`;
}

export function BottomNav() {
  return (
    <nav className="bottomNav" aria-label="Primary navigation">
      <NavLink to="/" end className={linkClass}>
        Dashboard
      </NavLink>
      <NavLink to="/data" className={linkClass}>
        Data / Logs
      </NavLink>
      <NavLink to="/league" className={linkClass}>
        League
      </NavLink>
    </nav>
  );
}
