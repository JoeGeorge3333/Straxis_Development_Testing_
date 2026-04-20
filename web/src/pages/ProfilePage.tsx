import { Link } from "react-router-dom";

export function ProfilePage() {
  return (
    <div className="card">
      <div className="cardHeader">
        <h2 className="cardTitle">Profile / Settings</h2>
      </div>
      <div className="panelBody">
        <Link to="/profile/emoji" className="button" style={{ display: "inline-block" }}>
          Change avatar emoji
        </Link>
        <div className="muted" style={{ marginTop: 16 }}>More settings later.</div>
      </div>
    </div>
  );
}

