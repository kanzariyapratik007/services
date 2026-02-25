import { useNavigate } from "react-router-dom";
import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/linkMobile.css";

export default function LinkMobileForm() {
    const navigate = useNavigate();


  const [formData, setFormData] = useState({
    applicant_name: "",
    epic: "",
    mobile: "",
    aadhaar: "",
    state: ""
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Application Submitted Successfully 🚀");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="form-page">

          <div className="form-header">
            <h2>Voter Mobile No. Link & Download</h2>
            <button
  className="applied-btn"
  onClick={() => navigate("/link-mobile-list")}
>
  Go to Applied List
</button>

          </div>

          <form className="form-container" onSubmit={handleSubmit}>

            <div className="form-grid">

              <div className="form-group">
                <label>Applicant Name *</label>
                <input
                  type="text"
                  name="applicant_name"
                  value={formData.applicant_name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>EPIC No. *</label>
                <input
                  type="text"
                  name="epic"
                  placeholder="VOTER NO."
                  value={formData.epic}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Mobile No. (Aadhaar Linked) *</label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="10 Digit"
                  value={formData.mobile}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Applicant Aadhaar No. *</label>
                <input
                  type="text"
                  name="aadhaar"
                  placeholder="12 Digit"
                  value={formData.aadhaar}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>State *</label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                >
                  <option value="">Select State</option>
                  <option>Karnataka</option>
                  <option>Maharashtra</option>
                  <option>Tamil Nadu</option>
                </select>
              </div>

            </div>

            <button className="submit-btn">
              Submit
            </button>

            <p className="note">
              Payable Amt: ₹30/- | Payments Wallet  
              <span className="offline">
                OFFLINE SERVICE (Processed within 2 Working Hrs.)
              </span>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
