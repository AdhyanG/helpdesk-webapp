// src/components/agent/AgentSidebar.tsx

import { useNavigate } from "react-router-dom";
import "./AgentSidebar.css";

export default function AgentSidebar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <aside className="agent-sidebar">

      <div className="sidebar-top">
        <h2>Agent Panel</h2>
        <p>Support Dashboard</p>
      </div>

      <div className="sidebar-menu">

        <div className="sidebar-link active">
          Manage Tickets
        </div>

      </div>

      <div className="sidebar-footer">
        <button
          className="logout-btn"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

    </aside>
  );
}