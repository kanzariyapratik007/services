import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/printServices.css";

export default function PrintServices() {
  const navigate = useNavigate();

  const categories = [
    { name: "Link Mobile No.", route: "/link-mobile", badge: "Manual Application" },
    { name: "Ration Card Services", route: "/ration-services", badge: "Category" },
    { name: "Voter Services", route: "/voter-services", badge: "Category" },
    { name: "DL Services", route: "/dl-services", badge: "Category" },
    { name: "Vehicle Services", route: "/vehicle-services", badge: "Category" },
    { name: "PAN Services", route: "/pan-services", badge: "Category" }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="print-page">
          <h2 className="page-title">Print Services</h2>

          <div className="print-grid">
            {categories.map((cat, index) => (
              <div
                key={index}
                className="print-card"
                onClick={() => cat.route && navigate(cat.route)}
              >
                <div className="print-icon">
                  {cat.name.charAt(0)}
                </div>

                <h4>{cat.name}</h4>

                <span
                  className={`badge ${
                    cat.badge === "Category" ? "yellow" : "green"
                  }`}
                >
                  {cat.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
