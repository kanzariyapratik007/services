import axios from "axios";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login() {

  const [form, setForm] = useState({
    username: "",
    password: ""
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.username || !form.password) {
      setError("Please enter username and password");
      return;
    }

    try {
      setLoading(true);

      localStorage.removeItem("access");
      localStorage.removeItem("refresh");

      const res = await axios.post(
        "http://127.0.0.1:8000/api/login/",
        form
      );

      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      navigate("/dashboard");

    } catch (err) {
      if (err.response?.status === 401) {
        setError("Invalid username or password");
      } else {
        setError("Server error. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* ================= LEFT PANEL ================= */}
      <div className="left-panel">

        <div className="left-logo">
          <img src="/logo.png" alt="Nath Sevaone" />
        </div>

        <h1>NATH SEVAONE</h1>
        <p>Secure Digital Service Platform</p>

      </div>

      {/* ================= RIGHT PANEL ================= */}
      <div className="right-panel">

        <div className="login-box">

          <div className="login-logo">
            <img src="/logo.png" alt="Nath Sevaone" />
          </div>

          <h2>Welcome Back</h2>

          {error && (
            <div className="error-box">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin}>

            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Username or Email"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-group password-group">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
              <span
                className="toggle-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </span>
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Signing In..." : "Sign In"}
            </button>

          </form>

          <div className="register-link">
            <p>
              Don't have an account?
              <span onClick={() => navigate("/register")}>
                Register here
              </span>
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}