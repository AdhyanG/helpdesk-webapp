// src/components/admin/TicketTable.tsx

import { useEffect, useState } from "react";
import api from "../../api/config";
import "../admin/TicketTable.css";
import TicketChatModal from "./TicketChatModal";
import UpdateStatusModal from "./UpdateStatusModal";
import AssignAgentModal from "./AssignAgentModal";

type Props = {
  activeSection: string;
  startDate: string;
  endDate: string;
};

export default function TicketTable({
  activeSection,
  startDate,
  endDate,
}: Props) {
  const role =
    localStorage.getItem("role")?.toLowerCase() ||
    "agent";

  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const [showAssignModal, setShowAssignModal] =
    useState(false);

  const [showStatusModal, setShowStatusModal] =
    useState(false);

  const [showChat, setShowChat] =
    useState(false);

  const [selectedTicket, setSelectedTicket] =
    useState<any>(null);

  const [openMenuId, setOpenMenuId] =
    useState<string | null>(null);

  /* PAGINATION */
  const [page, setPage] = useState(1);
  const [limit] = useState(5);

  const [totalPages, setTotalPages] =
    useState(1);

  const [totalCount, setTotalCount] =
    useState(0);

  /* ---------------- */

  const getTitle = () => {
    switch (activeSection) {
      case "unassigned":
        return "Unassigned Tickets";
      case "assigned":
        return "Assigned Tickets";
      case "progress":
        return "In Progress Tickets";
      case "resolved":
        return "Resolved Tickets";
      case "closed":
        return "Closed Tickets";
      default:
        return "Total Tickets";
    }
  };

  /* ---------------- */

  const fetchTickets = async () => {
    setLoading(true);

    try {
      const token =
        localStorage.getItem("token");

      const response = await api.get(
        `/tickets/getAllTickets?startDate=${startDate}&endDate=${endDate}&type=${activeSection}&page=${page}&limit=${limit}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets(
        response.data.tickets || []
      );

      setTotalPages(
        response.data.totalPages || 1
      );

      setTotalCount(
        response.data.totalCount || 0
      );
    } catch (error) {
      console.error(error);
      setTickets([]);
    } finally {
      setLoading(false);
    }
  };

  /* filter changed = reset page */
  useEffect(() => {
    setPage(1);
  }, [
    activeSection,
    startDate,
    endDate,
  ]);

  useEffect(() => {
    fetchTickets();
  }, [
    activeSection,
    startDate,
    endDate,
    page,
  ]);

  /* ---------------- */

  const openChat = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowChat(true);
    setOpenMenuId(null);
  };

  const handleAssign = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowAssignModal(true);
    setOpenMenuId(null);
  };

  const handleStatus = (ticket: any) => {
    setSelectedTicket(ticket);
    setShowStatusModal(true);
    setOpenMenuId(null);
  };

  /* ---------------- */

  return (
    <div className="ticket-table-card">
      <div className="table-top">
        <h2>{getTitle()}</h2>

        <p>
          Total Tickets:
          <strong>
            {" "}
            {totalCount}
          </strong>
        </p>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Customer</th>
              <th>Title</th>
              <th>Status</th>
              <th>Priority</th>
              <th>Assigned To</th>
              <th>Created</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8}>
                  Loading tickets...
                </td>
              </tr>
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={8}>
                  No tickets found.
                </td>
              </tr>
            ) : (
              tickets.map((item) => (
                <tr key={item.id}>
                  <td>{item.id}</td>
                  <td>
                    {item.customer_name}
                  </td>
                  <td>{item.title}</td>
                  <td>
                    {
                      item.status
                        ?.status_name
                    }
                  </td>
                  <td>
                    {
                      item.priority
                        ?.priority_name
                    }
                  </td>
                  <td>
                    {item.assignee
                      ?.name ||
                      "Unassigned"}
                  </td>
                  <td>
                    {new Date(
                      item.created_at
                    ).toLocaleDateString()}
                  </td>

                  <td className="action-cell">
                    <div className="action-menu">
                      <button
                        className="manage-btn"
                        onClick={() =>
                          setOpenMenuId(
                            openMenuId ===
                              item.id
                              ? null
                              : item.id
                          )
                        }
                      >
                        Manage ▾
                      </button>

                      {openMenuId ===
                        item.id && (
                        <div className="dropdown-menu">
                          <button
                            className="dropdown-item"
                            onClick={() =>
                              openChat(
                                item
                              )
                            }
                          >
                            💬 Chat
                          </button>

                          {role !==
                            "agent" && (
                            <button
                              className="dropdown-item"
                              onClick={() =>
                                handleAssign(
                                  item
                                )
                              }
                            >
                              👤 Assign
                              Agent
                            </button>
                          )}

                          <button
                            className="dropdown-item"
                            onClick={() =>
                              handleStatus(
                                item
                              )
                            }
                          >
                            🔄 Update
                            Status
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* PAGINATION */}
      {totalPages > 1 && (
        <div className="pagination">
          <button
            disabled={page === 1}
            onClick={() =>
              setPage(page - 1)
            }
          >
            Prev
          </button>

          <span>
            Page {page} of{" "}
            {totalPages}
          </span>

          <button
            disabled={
              page === totalPages
            }
            onClick={() =>
              setPage(page + 1)
            }
          >
            Next
          </button>
        </div>
      )}

      {/* MODALS */}

      {showChat &&
        selectedTicket && (
          <TicketChatModal
            ticket={selectedTicket}
            onClose={() =>
              setShowChat(false)
            }
          />
        )}

      {showAssignModal &&
        selectedTicket && (
          <AssignAgentModal
            ticket={selectedTicket}
            onClose={() =>
              setShowAssignModal(
                false
              )
            }
            onSuccess={
              fetchTickets
            }
          />
        )}

      {showStatusModal &&
        selectedTicket && (
          <UpdateStatusModal
            ticket={selectedTicket}
            onClose={() =>
              setShowStatusModal(
                false
              )
            }
            onSuccess={
              fetchTickets
            }
          />
        )}
    </div>
  );
}