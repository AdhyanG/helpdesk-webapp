// src/components/admin/AssignAgentModal.tsx

import { useState } from "react";
import { useUsers } from "../../hooks/usersData";
import { useQueryClient } from "@tanstack/react-query";
import api from "../../api/config";
import "./AssignAgentModal.css";

type Props = {
  ticket: any;
  onClose: () => void;
  onSuccess?: () => void;
};

export default function AssignAgentModal({
  ticket,
  onClose,
  onSuccess,
}: Props) {
  const { data: users, isLoading } = useUsers();

  const queryClient = useQueryClient();

  const [selectedUserId, setSelectedUserId] =
    useState("");

  const [assigning, setAssigning] =
    useState(false);

  const handleAssign = async () => {
    if (!selectedUserId) return;

    try {
      setAssigning(true);

      const token =
        localStorage.getItem("token");

      await api.patch(
        `/tickets/${ticket.id}/assign`,
        {
          userId: selectedUserId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // refresh tickets list
      await queryClient.invalidateQueries({
        queryKey: ["allTickets"],
      });

      if (onSuccess) onSuccess();

      onClose();
    } catch (error) {
      console.error(
        "Failed to assign agent",
        error
      );
    } finally {
      setAssigning(false);
    }
  };

  return (
    <div className="assign-overlay">
      <div className="assign-modal">

        {/* Header */}
        <div className="assign-header">
          <div>
            <h2>Assign Agent</h2>
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
        <div className="assign-body">
          <label>Select User</label>

          {isLoading ? (
            <p>Loading users...</p>
          ) : (
            <select
              value={selectedUserId}
              onChange={(e) =>
                setSelectedUserId(
                  e.target.value
                )
              }
            >
              <option value="">
                Choose user
              </option>

              {users?.map((user: any) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user.name} ({user.email})
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Footer */}
        <div className="assign-footer">
          <button
            className="cancel-btn"
            onClick={onClose}
            disabled={assigning}
          >
            Cancel
          </button>

          <button
            className="assign-btn"
            disabled={
              !selectedUserId || assigning
            }
            onClick={handleAssign}
          >
            {assigning
              ? "Assigning..."
              : "Assign Agent"}
          </button>
        </div>

      </div>
    </div>
  );
}