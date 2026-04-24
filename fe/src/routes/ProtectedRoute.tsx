
import { Navigate } from "react-router-dom";

export const ProtectedRoute=(props)=>{


      const token =
    localStorage.getItem("token");

  const userRole =
    localStorage.getItem("role");
      if (!token) {
    return <Navigate to="/login" />;
  }

  if (userRole !== props.role) {
    return <Navigate to="/login" />;
  }

  return props.page;
}
