import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/dlServices.css";

export default function DLServices() {

  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  /* ================= FETCH SERVICES ================= */

  useEffect(() => {

    const fetchServices = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/services/list/?category=driving",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setServices(res.data);

      } catch (err) {
        console.log(err);
      }
    };

    fetchServices();

  }, []);

  /* ================= HANDLE CLICK ================= */

  const handleClick = async (service) => {

    if (!token) {
      alert("Please login first");
      return;
    }

    if (service.service_type === "AUTOMATED") {

      const confirmAction = window.confirm(
        `Service: ${service.name}\nAmount: ₹${service.amount}\n\nProceed?`
      );

      if (!confirmAction) return;

      try {
        setLoading(true);

        await axios.post(
          "http://127.0.0.1:8000/api/services/automated/",
          { service_id: service.id },
          { headers: { Authorization: `Bearer ${token}` } }
        );

        alert("✅ Service processed instantly!");

      } catch (err) {
        alert(err.response?.data?.error || "Something went wrong");
      } finally {
        setLoading(false);
      }

    } else {

      navigate("/manual-service", {
        state: { service_id: service.id }
      });

    }
  };

  /* ================= UI ================= */

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="dl-page">

          <div className="dl-header">
            <button className="dl-title">
              Driving Licence Services
            </button>

            <button
              className="go-back"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>

          <div className="dl-grid">

            {services.map((service) => (
              <div
                key={service.id}
                className={`dl-card ${loading ? "disabled" : ""}`}
                onClick={() => !loading && handleClick(service)}
              >

                <div className="dl-icon">
                  {service.name.charAt(0)}
                </div>

                <h4>{service.name}</h4>

                <span className={`badge ${service.service_type === "AUTOMATED" ? "auto" : "manual"}`}>
                  {service.service_type}
                </span>

                <p className="processing-time">
                  {service.processing_time || "Instant / Real-time"}
                </p>

                <h3>₹{service.amount}</h3>

              </div>
            ))}

          </div>

          {loading && <div className="loading-overlay">Processing...</div>}

        </div>
      </div>
    </div>
  );
}