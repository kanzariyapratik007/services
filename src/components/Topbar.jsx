import { useEffect, useState } from "react";
import { FaMoon, FaSun, FaThLarge, FaWallet } from "react-icons/fa";
import { useTheme } from "../context/ThemeContext";
import API from "../api";
import "../styles/topbar.css";

export default function Topbar({ refreshTrigger }) {

  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { dark, setDark } = useTheme();

  const fetchBalance = async () => {
    try {
      const res = await API.get("wallet/balance/");
      setUserData(res.data);
    } catch (err) {

      if (err.response?.status === 401) {
        localStorage.clear();
        window.location.href = "/";
      }

    }
  };

  useEffect(() => {

    const token = localStorage.getItem("access");

    if (!token) {
      window.location.href = "/";
      return;
    }

    fetchBalance();

  }, [refreshTrigger]); // 🔥 Auto update when payment success

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="topbar">

      <div className="topbar-right">

        {/* Dark Mode Toggle */}
        <div
          className="topbar-icon"
          onClick={() => setDark(!dark)}
        >
          {dark ? <FaSun /> : <FaMoon />}
        </div>

        {/* Grid */}
        <div className="topbar-icon">
          <FaThLarge />
        </div>

        {/* Wallet Balance */}
        <div className="wallet-balance">
          <FaWallet />
          <span>₹{userData?.wallet_balance ?? 0}</span>
        </div>

        {/* Profile */}
        <div
          className="profile-section"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        >
          <div className="avatar">
            {userData?.name?.charAt(0) || "U"}
          </div>

          <div className="user-text">
            <p>{userData?.name || "User"}</p>
            <span>
              Nathsevaone{userData?.user_id || "0001"}
            </span>
          </div>

          {dropdownOpen && (
            <div className="dropdown-menu">
              <button>Profile</button>
              <button>Settings</button>
              <button onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}