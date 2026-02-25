import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/serviceHistory.css";

export default function ServiceHistory() {

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("access");

  useEffect(() => {
    if (!token) return;

    axios
      .get("http://127.0.0.1:8000/api/services/history/", {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then((res) => {
        setServices(res.data);
      })
      .catch(() => {
        alert("Failed to fetch service history");
      })
      .finally(() => {
        setLoading(false);
      });

  }, [token]);

  const getStatusClass = (status) => {
    if (status === "completed") return "status success";
    if (status === "processing") return "status pending";
    if (status === "rejected") return "status failed";
    return "status";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="service-history-page">

          <h2 className="page-title">Service History</h2>

          {loading ? (
            <div className="loading">Loading services...</div>
          ) : services.length === 0 ? (
            <div className="no-data">No services found.</div>
          ) : (
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Service Name</th>
                    <th>Amount</th>
                    <th>Status</th>
                    <th>Date & Time</th>
                  </tr>
                </thead>

                <tbody>
                  {services.map((service) => (
                    <tr key={service.id}>
                      <td>{service.order_id}</td>
                      <td>{service.service_name}</td>
                      <td>₹{service.amount}</td>
                      <td>
                        <span className={getStatusClass(service.status)}>
                          {service.status}
                        </span>
                      </td>
                      <td>
                        {new Date(service.created_at).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>

              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
