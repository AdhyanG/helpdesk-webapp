// src/pages/admin/AdminDashboardPage.tsx

import { useState } from "react";

import TicketTable from "../../components/admin/TicketTable";
import "./AgentDashbaordPage.css";
import AgentSidebar from "../../components/agent/AgentSidebar";

function AgentDashboardPage() {
  const today = new Date().toISOString().split("T")[0];

  const [activeSection, setActiveSection] = useState("total");
  const [startDate, setStartDate] = useState("2026-04-01");
  const [endDate, setEndDate] = useState(today);

  return (
    <div className="admin-dashboard-layout">
      <AgentSidebar
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <main className="admin-dashboard-content">
        <div className="dashboard-header">
         <div>
            <h1>Agent Dashboard</h1>
            <p>Manage your assigned tickets efficiently.</p>
          </div>
        </div> 

        {/* Filters */}
       <div className="dashboard-filter-card">
  <div className="dashboard-filter-row">

    <div className="filter-group">
      <label>Ticket Type</label>
      <select
        value={activeSection}
        onChange={(e) => setActiveSection(e.target.value)}
      >
        <option value="total">Total Tickets</option>
        <option value="unassigned">Unassigned</option>
        <option value="assigned">Assigned</option>
        <option value="progress">In Progress</option>
        <option value="resolved">Resolved</option>
        <option value="closed">Closed</option>
      </select>
    </div>

    <div className="filter-group">
      <label>Start Date</label>
      <input
        type="date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
    </div>

    <div className="filter-group">
      <label>End Date</label>
      <input
        type="date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
    </div>

    <button className="filter-btn">
      Apply
    </button>

  </div>
</div>

        <TicketTable
          activeSection={activeSection}
          startDate={startDate}
          endDate={endDate}
        />
      </main>
    </div>
  );
}

export default AgentDashboardPage;