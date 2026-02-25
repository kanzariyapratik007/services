import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/rationServices.css";

export default function RationServices() {

  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  const token = localStorage.getItem("access");

  /* ================= FETCH SERVICES ================= */

  useEffect(() => {

    if (!token) {
      navigate("/");
      return;
    }

    const fetchServices = async () => {

      try {

        const res = await axios.get(
          "http://127.0.0.1:8000/api/services/list/?category=ration",
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        setServices(res.data);

      } catch (err) {
        console.error("Service fetch error:", err);
        alert("Failed to load services");
      } finally {
        setFetching(false);
      }

    };

    fetchServices();

  }, [token, navigate]);

  /* ================= HANDLE CLICK ================= */

  const handleClick = async (service) => {

    if (!token) {
      alert("Please login first");
      return;
    }

    /* ========= AUTOMATED ========= */

    if (service.service_type === "AUTOMATED") {

  const confirmAction = window.confirm(
    `Service: ${service.name}\nAmount: ₹${service.amount}\n\nProceed?`
  );

  if (!confirmAction) return;

  try {

    setLoading(true);

    const res = await axios.post(
      "http://127.0.0.1:8000/api/services/automated/",
      {
        service_id: service.id
      },
      {
        headers: { Authorization: `Bearer ${token}` },
        responseType: "blob"   // 🔥 IMPORTANT
      }
    );

    // 🔥 Create download link
    const url = window.URL.createObjectURL(
      new Blob([res.data])
    );

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${service.slug}.pdf`);
    document.body.appendChild(link);
    link.click();
    link.remove();

    alert("✅ Service processed & PDF downloaded!");

    navigate("/service-history");

  } catch (err) {

    if (err.response?.data instanceof Blob) {
      const text = await err.response.data.text();
      alert(text);
    } else {
      alert("Something went wrong");
    }

  } finally {
    setLoading(false);
  }

}

    /* ========= MANUAL ========= */

    else {

      navigate("/manual-service", {
        state: {
          service_id: service.id
        }
      });

    }

  };

  /* ================= UI ================= */

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <Topbar />

        <div className="ration-page">

          <div className="ration-header">
            <h2>Ration Card Services</h2>
            <button
              className="go-back"
              onClick={() => navigate(-1)}
            >
              Go Back
            </button>
          </div>

          {/* ========= LOADING ========= */}
          {fetching && (
            <div className="loading-overlay">
              Loading Services...
            </div>
          )}

          {/* ========= EMPTY ========= */}
          {!fetching && services.length === 0 && (
            <p className="no-data">
              No services available
            </p>
          )}

          {/* ========= SERVICES ========= */}
          <div className="ration-grid">

            {services.map((service) => (

              <div
                key={service.id}
                className={`ration-item ${loading ? "disabled" : ""}`}
                onClick={() => !loading && handleClick(service)}
              >

                <div className="circle-icon">
                  {service.name.charAt(0)}
                </div>

                <h4>{service.name}</h4>

                <span
                  className={`badge ${
                    service.service_type === "AUTOMATED"
                      ? "auto"
                      : "manual"
                  }`}
                >
                  {service.service_type}
                </span>

                <p className="sub-text">
                  {service.processing_time}
                </p>

                <p className="price">
                  ₹{Number(service.amount).toFixed(2)}
                </p>

              </div>

            ))}

          </div>

          {/* ========= PROCESSING ========= */}
          {loading && (
            <div className="loading-overlay">
              Processing...
            </div>
          )}

        </div>

      </div>

    </div>
  );
}