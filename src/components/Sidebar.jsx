import { NavLink, useNavigate } from "react-router-dom";
import {
  FaTachometerAlt,
  FaWallet,
  FaFileAlt,
  FaUserCog,
  FaSignOutAlt
} from "react-icons/fa";

import "../styles/sidebar.css";

export default function Sidebar() {

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    navigate("/");
  };

  return (
    <div className="sidebar">

      {/* ================= LOGO ================= */}
      <div className="logo">
        <img src="/logo.png" alt="Nath Sevaone" />
      </div>

      {/* ================= MAIN MENU ================= */}
      <div className="section-title">MAIN</div>

      <ul className="menu">

        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <FaTachometerAlt />
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/wallet"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <FaWallet />
            <span>Wallet</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/wallet-transactions"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <FaFileAlt />
            <span>Wallet Transactions</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/transaction-details"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <FaFileAlt />
            <span>Transaction Details</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/profile-settings"
            className={({ isActive }) => isActive ? "active" : ""}
          >
            <FaUserCog />
            <span>Profile Settings</span>
          </NavLink>
        </li>

      </ul>

      {/* ================= LOGOUT ================= */}
      <div className="logout">
        <ul className="menu">
          <li>
            <button className="logout-btn" onClick={handleLogout}>
              <FaSignOutAlt />
              <span>Logout</span>
            </button>
          </li>
        </ul>
      </div>

    </div>
  );
}