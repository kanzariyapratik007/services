import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/rationForm.css";

export default function RationToAadhaarForm() {

  const navigate = useNavigate();

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="form-page">

          {/* Page Title */}
          <div className="page-heading">
            <h2>Ration To Aadhaar : Application</h2>
          </div>

          {/* Main Card */}
          <div className="form-card">

            <div className="form-header">
              <h3>RATION TO AADHAAR : APPLICATION</h3>

              <button
                className="applied-btn"
                onClick={() => navigate("/service-history")}
              >
                Go to Applied List
              </button>
            </div>

            {/* Price Box */}
            <div className="price-box">
              Service Price: <strong>₹30.00</strong> per application
            </div>

            <div className="form-section">

              <h4 className="section-title">Form Details</h4>

              {/* Customer Name */}
              <div className="form-group">
                <label>Customer Name <span>*</span></label>
                <input type="text" placeholder="Enter Customer Name" />
                <small>Example: PRAJWAL GANGER</small>
              </div>

              {/* Ration Card Number */}
              <div className="form-group">
                <label>Enter Ration Card No <span>*</span></label>
                <input type="text" placeholder="Enter Ration Card Number" />
                <small>Example: 5X010X1X8XX6</small>
              </div>

              {/* Buttons */}
              <div className="form-buttons">
                <button className="submit-btn">
                  Submit Application
                </button>

                <button className="reset-btn">
                  Reset
                </button>
              </div>

            </div>

          </div>

        </div>
      </div>
    </div>
  );
}
