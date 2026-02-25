import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/panServices.css";

export default function PanServices() {

  const navigate = useNavigate();
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  /* ================= FETCH SERVICES ================= */

  useEffect(() => {

    const fetchServices = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/api/services/list/?category=pan",
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

        <div className="pan-page">

          <div className="pan-header">
            <h2>Pan Card Services</h2>
            <button onClick={() => navigate(-1)}>Go Back</button>
          </div>

          <div className="pan-grid">

            {services.length === 0 && (
              <p>No PAN services available</p>
            )}

            {services.map((service) => (
              <div
                key={service.id}
                className={`pan-card ${loading ? "disabled" : ""}`}
                onClick={() => !loading && handleClick(service)}
              >

                <div className="pan-icon">
                  {service.name.charAt(0)}
                </div>

                <h4>{service.name}</h4>

                <span className={`badge ${service.service_type === "AUTOMATED" ? "auto" : "manual"}`}>
                  {service.service_type}
                </span>

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