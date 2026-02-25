import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/form.css";

export default function GruhaLaxmiForm() {
  const [formData, setFormData] = useState({
    applicant_name: "",
    aadhaar: "",
    mobile: "",
    address: "",
    income: "",
    bank_account: "",
    ifsc: "",
    ration_card: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;

    if (files) {
      setFormData({ ...formData, [name]: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    alert("Gruha Laxmi Application Submitted!");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="form-container">
          <div className="form-header">
            <h2>Gruha Laxmi : Application</h2>
            <button className="applied-btn">
              Go to Applied List
            </button>
          </div>

          <form onSubmit={handleSubmit} className="form-grid">

            <div className="form-group">
              <label>Applicant Name *</label>
              <input
                type="text"
                name="applicant_name"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Aadhaar Number *</label>
              <input
                type="text"
                name="aadhaar"
                maxLength="12"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Mobile Number *</label>
              <input
                type="text"
                name="mobile"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Address *</label>
              <input
                type="text"
                name="address"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Monthly Income *</label>
              <input
                type="number"
                name="income"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Bank Account Number *</label>
              <input
                type="text"
                name="bank_account"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>IFSC Code *</label>
              <input
                type="text"
                name="ifsc"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <label>Upload Ration Card *</label>
              <input
                type="file"
                name="ration_card"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group full-width">
              <button type="submit" className="submit-btn">
                Submit Application
              </button>
            </div>

          </form>
        </div>
      </div>
    </div>
  );
}
