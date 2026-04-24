// src/components/admin/AdminSidebar.tsx

import "./AdminSidebar.css"
import { useNavigate } from "react-router-dom";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  }
  return (
    <aside className="admin-sidebar">
      <div className="sidebar-top">
        <h2>Admin Panel</h2>
        <p>Ticket Management</p>
      </div>

      <div className="sidebar-menu">

        <div className="sidebar-card">
          <span className="sidebar-label">System Role</span>
          <h3>Administrator</h3>
        </div>
{/* 
        <div className="sidebar-card">
          <span className="sidebar-label">Dashboard</span>
          <p>Manage all support tickets efficiently.</p>
        </div> */}

        <div className="sidebar-card">
          <span className="sidebar-label">Quick Access</span>
          <ul className="sidebar-list">
            <li>View All Tickets</li>
            <li>Assign Agents</li>
            <li>Track Progress</li>
            <li>Resolve Issues</li>
          </ul>
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