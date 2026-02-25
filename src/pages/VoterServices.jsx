import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/VoterServices.css";

export default function VoterServices() {

  const navigate = useNavigate();

  const services = [
    { title: "Name Correction", slug: "voter-name-correction", icon: "📝" },
    { title: "Update Mobile No.", slug: "voter-mobile-link", icon: "📱" },
    { title: "Photo Correction", slug: "voter-photo-correction", icon: "🖼️" },
    { title: "Address Correction", slug: "voter-address-correction", icon: "📍" },
    { title: "Gender Correction", slug: "voter-gender-correction", icon: "⚧️" },
    { title: "DOB / Age Correction", slug: "voter-dob-correction", icon: "📅" },
    { title: "Original Voter Card PDF", slug: "voter-download", icon: "📄" },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar />

        <div className="voter-page">

          <div className="voter-header">
            <button className="back-btn" onClick={() => navigate(-1)}>
              ⬅ Go Back
            </button>
            <h2>Voter Card Services</h2>
          </div>

          <div className="service-grid">

            {services.map((service, index) => (
              <div
                className="service-card"
                key={index}
                onClick={() => navigate(`/service/${service.slug}`)}
              >
                <div className="icon-circle">
                  {service.icon}
                </div>
                <h4>{service.title}</h4>
              </div>
            ))}

          </div>

        </div>

      </div>
    </div>
  );
}