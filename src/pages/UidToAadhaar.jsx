import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/serviceForm.css";

export default function UidToAadhaar() {

  const navigate = useNavigate();
  const token = localStorage.getItem("access");

  const [uid, setUid] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);

  const amount = 200;

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!uid || !name) {
      alert("All fields are required");
      return;
    }

    if (uid.length !== 12) {
      alert("UID must be 12 digits");
      return;
    }

    const confirmAction = window.confirm(
      `Service: UID to Aadhaar PDF\nAmount: ₹${amount}\n\nProceed?`
    );

    if (!confirmAction) return;

    try {
      setLoading(true);

      await axios.post(
        "https://servicepratik.pythonanywhere.com/api/services/manual/",
        {
          service_name: "UID to Aadhaar PDF",
          amount: amount,
          uid_number: uid,
          applicant_name: name
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      alert("✅ Application submitted successfully!");
      navigate(-1);

    } catch (err) {
      alert(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <Topbar />

        <div className="form-page">

          <div className="form-card">

            <div className="form-header">
              <h2>UID TO AADHAAR PDF</h2>
              <button
                className="applied-btn"
                onClick={() => navigate("/applied-services")}
              >
                Go to Applied List
              </button>
            </div>

            <form onSubmit={handleSubmit}>

              <div className="form-grid">

                <div className="form-group">
                  <label>UID Number *</label>
                  <input
                    type="text"
                    placeholder="12 Digit UID Number"
                    maxLength={12}
                    value={uid}
                    onChange={(e) => setUid(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label>Name *</label>
                  <input
                    type="text"
                    placeholder="Enter Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>

              </div>

              <button
                type="submit"
                className="submit-btn"
                disabled={loading}
              >
                {loading ? "Processing..." : "SUBMIT"}
              </button>

              <p className="payable">
                Payable Amt: ₹{amount}/-
              </p>

              <p className="note">
                OFFLINE APPLICATION — Will be processed within working hours.
              </p>

            </form>

          </div>

        </div>

      </div>

    </div>
  );
}