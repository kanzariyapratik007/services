import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/form.css";

export default function LmsCertificate() {

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="form-container">

          <div className="form-header">
            <h2>LMS Certificate</h2>
          </div>

          <form className="form-grid">

            <div className="form-group">
              <label>Application ID *</label>
              <input type="text" placeholder="Enter Application ID" required />
            </div>

            <div className="form-group full-width">
              <button type="submit" className="submit-btn">
                Submit
              </button>
            </div>

          </form>

        </div>
      </div>
    </div>
  );
}