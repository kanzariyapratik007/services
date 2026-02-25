import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/manualService.css";

export default function ManualService() {

  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const { service_name, amount } = location.state || {};

  const [formData, setFormData] = useState({
    customer_name: "",
    ration_number: ""
  });

  const handleSubmit = async () => {
    try {
      await axios.post(
        "https://servicepratik.pythonanywhere.com/api/services/manual/",
        {
          service_name,
          amount,
          ...formData
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("✅ Application submitted successfully!");
      navigate(-1);

    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />

        <div className="manual-page">

          <h2>{service_name}</h2>
          <p className="price-box">Service Price: ₹{amount}</p>

          <div className="form-group">
            <label>Customer Name</label>
            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, customer_name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Ration Card Number</label>
            <input
              type="text"
              onChange={(e) =>
                setFormData({ ...formData, ration_number: e.target.value })
              }
            />
          </div>

          <button className="submit-btn" onClick={handleSubmit}>
            Submit Application
          </button>

        </div>
      </div>
    </div>
  );
}
