import { useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/aadhaarServices.css";

export default function AadhaarServices() {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("access");

  /* ================= SERVICES DATA ================= */

  const services = [
    {
      name: "Aadhaar PDF Download",
      slug: "uid-to-aadhaar",
      type: "MANUAL",
      amount: 200,
      time: "Within 24 Hours"
    },
    {
      name: "EID to UID",
      slug: "eid-to-uid",
      type: "MANUAL",
      amount: 750,
      time: "Within 24 Hours"
    },
    {
      name: "LMS Certificate",
      slug: "lms-certificate",
      type: "MANUAL",
      amount: 1000,
      time: "Within 24 Hours"
    },
    {
      name: "Aadhaar PAN Status",
      type: "AUTOMATED",
      amount: 10,
      time: "Instant Download"
    }
  ];

  /* ================= AUTOMATED SERVICE ================= */

  const handleAutomated = async (service) => {

    const confirmAction = window.confirm(
      `Service: ${service.name}\nAmount: ₹${service.amount}\n\nProceed?`
    );

    if (!confirmAction) return;

    try {
      setLoading(true);

      await axios.post(
        "http://127.0.0.1:8000/api/services/automated/",
        {
          service_name: service.name,
          amount: service.amount
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("✅ Service processed successfully!");

    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  /* ================= CLICK HANDLER ================= */

  const handleClick = (service) => {

    if (service.type === "AUTOMATED") {
      handleAutomated(service);
    } else {
      // 🔥 Manual services open dedicated page
      navigate(`/${service.slug}`);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="aadhaar-page">

          <div className="aadhaar-header">
            <h2>Aadhaar Services</h2>
          </div>

          <div className="aadhaar-grid">

            {services.map((service, index) => (
              <div
                key={index}
                className={`aadhaar-card ${loading ? "disabled" : ""}`}
                onClick={() => !loading && handleClick(service)}
              >

                <div className="aadhaar-icon">
                  {service.name.charAt(0)}
                </div>

                <h4>{service.name}</h4>

                <span className={`badge ${service.type === "AUTOMATED" ? "auto" : "manual"}`}>
                  {service.type === "AUTOMATED"
                    ? "⚡ Automated Service"
                    : "📋 Manual Service"}
                </span>

                <h3>₹{service.amount.toFixed(2)}</h3>

                <p>{service.time}</p>

              </div>
            ))}

          </div>

          {loading && <div className="loading-overlay">Processing...</div>}

        </div>
      </div>
    </div>
  );
}