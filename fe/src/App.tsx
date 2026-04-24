
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import './App.css'
import { CustomerTicketPage } from "./pages/customer/CustomerTicketPage";
import TrackingTicketPage from "./pages/customer/TrackingTicketPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";
import LoginForm from "./components/auth/LoginForm"
import AgentDashboardPage from "./pages/agent/AgentDashboardPage";
import { ProtectedRoute } from "./routes/ProtectedRoute";


function App() {
return(

  <BrowserRouter>
  <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          duration: 3000,
        }}
      />

  <Routes>
    //Public routes
    <Route path="/" element={<CustomerTicketPage />} />
    <Route path="/track-ticket" element={<TrackingTicketPage />} />
    <Route path="/login" element={<LoginForm />} />

    //Protected routes
    <Route path="/admin/dashboard" element={<ProtectedRoute role="Admin" page={<AdminDashboardPage />} />} />
    <Route path="/agent/dashboard" element={<ProtectedRoute role="Agent" page={<AgentDashboardPage />} />} />
  </Routes>
  
  </BrowserRouter>
)
}

export default App
