import { useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/form.css";

export default function SeniorCitizenForm() {
  const [formData, setFormData] = useState({
    applicant_name: "",
    aadhaar: "",
    mobile: "",
    email: "",
    gender: "",
    dob: "",
    address: "",
    taluk: "",
    district: "",
    pincode: "",
    photo: null,
    aadhaar_file: null,
    blood_report: null,
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
    alert("Application Submitted Successfully!");
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="form-container">
          <div className="form-header">
            <h2>Senior Citizen : Application</h2>
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
              <label>Mobile No. (for OTP) *</label>
              <input
                type="text"
                name="mobile"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Email ID *</label>
              <input
                type="email"
                name="email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select
                name="gender"
                onChange={handleChange}
                required
              >
                <option value="">Select</option>
                <option>Male</option>
                <option>Female</option>
                <option>Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>DOB *</label>
              <input
                type="date"
                name="dob"
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
              <label>Taluk *</label>
              <input
                type="text"
                name="taluk"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>District *</label>
              <input
                type="text"
                name="district"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Pincode *</label>
              <input
                type="text"
                name="pincode"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Photo *</label>
              <input
                type="file"
                name="photo"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Upload Aadhaar *</label>
              <input
                type="file"
                name="aadhaar_file"
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Blood Group Report *</label>
              <input
                type="file"
                name="blood_report"
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
