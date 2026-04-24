import {useState} from 'react';
import { toast } from "react-hot-toast";
import api from "../../api/config";
import "./TrackingTicketPage.css";

function TrackingTicketPage() {
const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    ticketId: "",
  });

  const handleChange=(event)=>{
    const {name,value}=event.target;
    setFormData((prevData)=>({
        ...prevData,
        [name]:value
    }))
  }

  const handleSubmit = async(event)=>{
    event.preventDefault();
    if(loading) return;
    setLoading(true);
    try{

 const response= await api.post("/tickets/getMyTicketStatus", formData);
console.log("Ticket status response", response.data);
 setTicketData(response.data);  
 setLoading(false);
 setFormData({
    email: "",
    ticketId: "",
 })
    }
    catch(error){
        toast.error(
            error?.response?.data?.message || "Failed to fetch ticket status."
        );
        console.error("Error fetching ticket status", error);
    }
    finally{
        setLoading(false);
    }

  }

  const [ticketData, setTicketData] = useState<any>(null);

    return (
    <div className="ticket-page">
      <div className="ticket-card">
        <div className="ticket-header">
          <h1>Track Ticket Status</h1>
          <p>Enter your registered email and ticket ID.</p>
        </div>

        <form onSubmit={handleSubmit} className="ticket-form">
          <div>
            <label>
              Registered Email <span className="required">*</span>
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter registered email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>
              Ticket ID <span className="required">*</span>
            </label>

            <input
              type="text"
              name="ticketId"
              placeholder="Enter ticket ID"
              value={formData.ticketId}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Checking..." : "Check Status"}
          </button>
        </form>

        {ticketData && (
          <div className="status-card">
            <h3>Ticket Details</h3>

            <div className="status-row">
              <span>Ticket ID:</span>
              <strong>{ticketData.ticket_id}</strong>
            </div>

            <div className="status-row">
              <span>Status:</span>
              <strong>{ticketData.status}</strong>
            </div>

            <div className="status-row">
              <span>Title:</span>
              <strong>{ticketData.title}</strong>
            </div>

            <div className="status-row">
              <span>Subject:</span>
              <strong>{ticketData.subject}</strong>
            </div>

            <div className="status-row">
              <span>Created:</span>
              <strong>{ticketData.created_at}</strong>
            </div>
          </div>
        )}
        
        {ticketData?.replies?.length > 0 && (
  <div className="status-card">
    <h3>Conversation Updates</h3>

    {ticketData.replies.map((item: any, index: number) => (
      <div key={index} className="reply-box">
        <div className="reply-top">
          <strong>{item.sender}</strong>
          <span>{item.role}</span>
        </div>

        <p>{item.message}</p>

        <small>
          {new Date(item.created_at).toLocaleString()}
        </small>
      </div>
    ))}
  </div>
)}
      </div>
    </div>
  );
}
export default TrackingTicketPage;