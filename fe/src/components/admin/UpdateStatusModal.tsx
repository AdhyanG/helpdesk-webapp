// src/components/admin/UpdateStatusModal.tsx

import { useState } from "react";
import api from "../../api/config";
import "./UpdateStatusModal.css";

type Props = {
  ticket: any;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function UpdateStatusModal({
  ticket,
  onClose,
  onSuccess,
}: Props) {
  const [statusId, setStatusId] = useState(
    ticket?.status?.id || ""
  );

  const [loading, setLoading] =
    useState(false);

  const statuses = [
    { id: 1, name: "Open" },
    { id: 2, name: "In Progress" },
    // { id: 3, name: "Reassigned" },
    { id: 4, name: "Resolved" },
    { id: 5, name: "Closed" },
  ];

  const handleUpdate = async () => {
    if (!statusId) return;

    try {
      setLoading(true);

      const token =
        localStorage.getItem("token");

      await api.patch(
        `/tickets/${ticket.id}/status`,
        {
          statusId: Number(statusId),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (onSuccess) onSuccess();

      onClose();
    } catch (error) {
      console.error(
        "Failed to update status",
        error
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="status-overlay">
      <div className="status-modal">

        {/* Header */}
        <div className="status-header">
          <div>
            <h2>Update Status</h2>
            <p>{ticket.id}</p>
          </div>

          <button
            className="close-btn"
            onClick={onClose}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="status-body">
          <label>Select Status</label>

          <select
            value={statusId}
            onChange={(e) =>
              setStatusId(
                e.target.value
              )
            }
          >
            <option value="">
              Choose status
            </option>

            {statuses.map((item) => (
              <option
                key={item.id}
                value={item.id}
              >
                {item.name}
              </option>
            ))}
          </select>
        </div>

        {/* Footer */}
        <div className="status-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="update-btn"
            disabled={
              !statusId || loading
            }
            onClick={handleUpdate}
          >
            {loading
              ? "Updating..."
              : "Update Status"}
          </button>
        </div>

      </div>
    </div>
  );
}