import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Eye, EyeOff } from "lucide-react";
import api from "../../api/config";
import "./LoginForm.css";

function LoginForm() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const response = await api.post("/auth/login", formData);

      const data = response.data;

      localStorage.setItem("token", data.access_token);
      localStorage.setItem("role", data.user.role);

      toast.success("Login successful!");

      if (data.user.role === "Admin") {
        console.log("Admin logged in");
        navigate("/admin/dashboard");
      } else if (data.user.role === "Agent") {
        navigate("/agent/dashboard");
      } else {
        navigate("/");
      }
    } catch (error: any) {
      toast.error(
        error?.response?.data?.message || "Invalid credentials"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1>Helpdesk Portal</h1>
        <p>Sign in to continue</p>

        <form onSubmit={handleSubmit} className="login-form">
          <div>
            <label>
              Email <span className="required">*</span>
            </label>

            <input
              type="email"
              name="email"
              placeholder="Enter email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div>
            <label>
              Password <span className="required">*</span>
            </label>

            <div className="password-box">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                required
              />

              <button
                type="button"
                className="eye-btn"
                onClick={() =>
                  setShowPassword(!showPassword)
                }
              >
                {showPassword ? (
                  <Eye size={18} />
                ) : (
                  <EyeOff size={18} />
                )}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Signing In..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;