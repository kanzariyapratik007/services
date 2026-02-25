import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dashboard.css";

import {
  FaWallet,
  FaExchangeAlt,
  FaCalendarDay,
  FaMoneyBillWave
} from "react-icons/fa";

export default function Dashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("access");

    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://127.0.0.1:8000/api/dashboard/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setData(res.data))
      .catch(() => {
        localStorage.removeItem("access");
        navigate("/");
      });
  }, [navigate]);

  /* SERVICES WITH ROUTES */
  const services = [
    { name: "Government Services", route: "/govt-services" },
    { name: "Print Services", route: "/print-services" },
    { name: "Voter Services", route: "/voter-services" },
    { name: "Aadhaar Services", route: "/aadhaar-services" },
    { name: "DL Services", route: "/dl-services" },
    { name: "Vehicle Services", route: "/vehicle-services" },
    { name: "Ration Card", route: "/ration-services" },
    { name: "PAN Services", route: "/pan-services" }
  ];

  if (!data) return null;

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        {/* ================= STATS ================= */}
        <div className="stats-grid">

          <div className="stat-card">
            <FaWallet className="stat-icon purple" />
            <h4>Wallet Balance</h4>
            <h2>₹{data.wallet_balance}</h2>
          </div>

          <div className="stat-card">
            <FaExchangeAlt className="stat-icon blue" />
            <h4>Total Transactions</h4>
            <h2>{data.total_transactions}</h2>
          </div>

          <div className="stat-card">
            <FaCalendarDay className="stat-icon orange" />
            <h4>Today's Transactions</h4>
            <h2>{data.today_transactions}</h2>
          </div>

          <div className="stat-card">
            <FaMoneyBillWave className="stat-icon green" />
            <h4>Total Spent</h4>
            <h2>₹{data.total_spent}</h2>
          </div>

        </div>

        {/* ================= SERVICES ================= */}
        <div className="service-section">
          <h2 className="section-title">Service Categories</h2>

          <div className="service-grid">
            {services.map((service, index) => (
              <div
                key={index}
                className="service-card"
                onClick={() => navigate(service.route)}
              >
                <div className="circle-icon">
                  {service.name.charAt(0)}
                </div>
                <p>{service.name}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
