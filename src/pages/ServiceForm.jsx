import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/form.css";

/* ================= STATIC FORM STRUCTURE ONLY ================= */
/* ⚠ Amount yaha nahi hoga — DB se aayega */

const serviceFields = {

  "senior-citizen": [
    { name: "applicant_name", label: "Applicant Name", type: "text" },
    { name: "aadhaar", label: "Aadhaar Number", type: "text", maxLength: 12 },
    { name: "mobile", label: "Mobile Number", type: "text", maxLength: 10 },
    { name: "photo", label: "Upload Photo", type: "file", full: true }
  ],

  "gruha-laxmi": [
    { name: "applicant_name", label: "Applicant Name", type: "text" },
    { name: "aadhaar", label: "Aadhaar Number", type: "text", maxLength: 12 },
    { name: "income", label: "Monthly Income", type: "number" }
  ]

};

/* ================= COMPONENT ================= */

export default function ServiceForm() {

  const { serviceSlug } = useParams();
  const navigate = useNavigate();

  const [service, setService] = useState(null);
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("access");

  /* ================= FETCH SERVICE FROM DB ================= */

  useEffect(() => {

    const fetchService = async () => {

      try {
        const res = await axios.get(
          `https://servicepratik.pythonanywhere.com/api/services/list/`,
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );

        const foundService = res.data.find(
          (s) => s.slug === serviceSlug
        );

        if (!foundService) {
          alert("Service not found");
          navigate("/dashboard");
          return;
        }

        setService(foundService);

      } catch (err) {
        console.log(err);
      }

    };

    fetchService();

  }, [serviceSlug]);

  if (!service) {
    return <div style={{ padding: "50px" }}>Loading...</div>;
  }

  const fields = serviceFields[serviceSlug] || [];

  /* ================= INPUT HANDLER ================= */

  const handleChange = (e) => {

    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  /* ================= SUBMIT ================= */

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {
      setLoading(true);

      const data = new FormData();

      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });

      data.append("service_id", service.id);

      await axios.post(
        "http://127.0.0.1:8000/api/services/manual/",
        data,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("Service Submitted Successfully!");
      navigate("/wallet-transactions");

    } catch (err) {
      alert(err.response?.data?.error || "Service failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <Topbar />

        <div className="form-container">

          <div className="form-header">
            <h2>{service.name}</h2>
            <p>Service Price: ₹{service.amount}</p>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">

            {fields.map((field, index) => (

              <div
                key={index}
                className={`form-group ${field.full ? "full-width" : ""}`}
              >

                <label>{field.label}</label>

                <input
                  type={field.type}
                  name={field.name}
                  maxLength={field.maxLength || undefined}
                  onChange={handleChange}
                  required
                />

              </div>

            ))}

            <div className="form-group full-width">
              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Processing..." : "Submit Application"}
              </button>
            </div>

          </form>

        </div>

      </div>

    </div>
  );
}