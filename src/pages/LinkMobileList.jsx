import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/appliedList.css";

export default function LinkMobileList() {
  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="list-page">

          <div className="list-header">
            <h2>
              Offline Mobile Link List
              <span className="badge yellow">Pending: 0</span>
              <span className="badge green">Approved: 0</span>
              <span className="badge red">Rejected: 0</span>
            </h2>

            <button className="apply-btn">
              Apply New
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Applicant Name</th>
                  <th>EPIC No.</th>
                  <th>Mobile</th>
                  <th>Aadhaar No.</th>
                  <th>State</th>
                  <th>Date & Time</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                <tr>
                  <td colSpan="10" className="no-data">
                    No applications found.
                  </td>
                </tr>
              </tbody>

            </table>
          </div>

        </div>
      </div>
    </div>
  );
}
