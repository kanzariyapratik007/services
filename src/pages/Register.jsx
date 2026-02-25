import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/login.css";

export default function Register() {

  const [form, setForm] = useState({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    const { username, email, phone, password, confirmPassword } = form;

    if (!username || !email || !phone || !password || !confirmPassword) {
      alert("All fields required");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      await axios.post("http://127.0.0.1:8000/api/register/", {
        username,
        email,
        phone,
        password
      });

      alert("Account created successfully!");
      navigate("/");

    } catch (err) {
      alert(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">

      {/* LEFT PANEL */}
      <div className="left-panel">

        <div className="brand-logo">
          <img src="/logo.png" alt="Logo" />
        </div>

        <h1>NATH SEVAONE</h1>
        <p>Secure Digital Service Platform</p>

      </div>

      {/* RIGHT PANEL */}
      <div className="right-panel">

        <div className="login-box">

          <h2>Create Account</h2>

          <form onSubmit={handleRegister}>

            <div className="input-group">
              <input
                type="text"
                name="username"
                placeholder="Username"
                value={form.username}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
              />
            </div>

            <div className="input-group">
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm Password"
                value={form.confirmPassword}
                onChange={handleChange}
              />
            </div>

            <button
              type="submit"
              className="login-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Register"}
            </button>

          </form>

          <div className="register-link">
            <p>
              Already have an account?
              <span onClick={() => navigate("/")}>
                Login here
              </span>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
}