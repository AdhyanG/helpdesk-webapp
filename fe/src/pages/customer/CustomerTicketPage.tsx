import { useState } from "react";
import "../CustomerTicketPage.css";
import api from "../../api/config";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const CustomerTicketPage = () => {
 const navigate = useNavigate();
 const [loading, setLoading] = useState(false);  
 const [showPopup, setShowPopup] = useState(false);
const [ticketId, setTicketId] = useState(""); 
const [formData, setFormData] = useState({
    customer_name: "",
    customer_email: "",
    subject: "",
    title:"",
    body: "",
  });
  
  const resetForm = () => {
    setFormData({
      customer_name: "",
      customer_email: "",
      subject: "",
      title: "",
      body: "",
    });
  };
const handleChange=(event)=>{
    const { name, value } = event.target;

     setFormData((prevData)=>({
        ...prevData,
        [name]:value
     }))

}

  const handleSubmit= async (event)=>{
  event.preventDefault();
     if (loading) return;
  setLoading(true);
  try {
  const response = await api.post("/tickets/createTicket", formData);

setTicketId(response.data.ticket_id); // adjust key from API
setShowPopup(true);

toast.success("Ticket submitted successfully!");
resetForm();
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Failed to submit ticket."
      );
      console.error("Error submitting ticket", error);
    } finally {
      setLoading(false);
    }


  }
  //to copy ticket id to clipboard
  const copyTicketId = () => {
  navigator.clipboard.writeText(ticketId);
  toast.success("Ticket ID copied!");
};

  return (
   <div className="ticket-page">
      <div className="ticket-card">
      <div className="ticket-header">
  <div className="header-top">
    <h1>Create Support Ticket</h1>

    <button
      type="button"
      className="track-status-btn"
      onClick={() => navigate("/track-ticket")}
    >
      Track Status
    </button>
  </div>

  <p>Describe your issue and our team will contact you soon.</p>
</div>
        <form onSubmit={handleSubmit} className="ticket-form">
          <div className="ticket-grid">
            <div>
              <label>
                Full Name <span className="required">*</span>
              </label>

              <input
                type="text"
                name="customer_name"
                placeholder="Enter full name"
                value={formData.customer_name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label>
                Email <span className="required">*</span>
              </label>

              <input
                type="email"
                name="customer_email"
                placeholder="Enter email"
                value={formData.customer_email}
                onChange={handleChange}
                required
              />
            </div>
          </div>

          <div>
            <label>
              Ticket Title <span className="required">*</span>
            </label>

            <input
              type="text"
              name="title"
              placeholder="Enter ticket title"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>
              Subject <span className="required">*</span>
            </label>

            <input
              type="text"
              name="subject"
              placeholder="Enter subject"
              value={formData.subject}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>
              Message <span className="required">*</span>
            </label>

            <textarea
              name="body"
              rows={5}
              placeholder="Describe issue..."
              value={formData.body}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Submitting..." : "Submit Ticket"}
          </button>

        </form>
        {showPopup && (
  <div className="popup-overlay">
    <div className="popup-box">
      <h2>Ticket Created 🎉</h2>
      <p>Your support ticket has been created.</p>

      <div className="ticket-id-box">
        <span>{ticketId}</span>
        <button onClick={copyTicketId}>Copy</button>
      </div>

      <button
        className="close-btn"
        onClick={() => setShowPopup(false)}
      >
        Close
      </button>
    </div>
  </div>
)}
      </div>
    </div>
  );
    
}