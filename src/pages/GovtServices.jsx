import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import "../styles/govtservices.css";

export default function GovtServices() {

  const navigate = useNavigate();

  /* ================= SERVICES LIST ================= */

  const services = [

    // ===== Karnataka Schemes =====
    { name: "Senior Citizen Card", price: 50, slug: "senior-citizen" },
    { name: "Gruha Laxmi Sanction Order", price: 30, slug: "gruha-laxmi-sanction" },
    { name: "Gruha Laxmi Application", price: 30, slug: "gruha-laxmi" },
    { name: "Gruha Laxmi Status", price: 30, slug: "gruha-laxmi-status" },
    { name: "Gruha Laxmi KYC", price: 30, slug: "gruha-laxmi-kyc" },
    { name: "Gruha Jyothi", price: 30, slug: "gruha-jyothi" },
    { name: "Gruha Jyothi D-Link", price: 30, slug: "gruha-jyothi-dlink" },

    // ===== Land & Revenue =====
    { name: "Link Aadhaar & Pahani", price: 40, slug: "aadhaar-pahani" },
    { name: "Download RTC", price: 15, slug: "download-rtc" },

    // ===== Health =====
    { name: "ABHA Card", price: 30, slug: "abha-card" },

    // ===== Category Based Pages =====
    { name: "Ration Card Services", price: 0, slug: "ration-services", type: "page" },
    { name: "Aadhaar Services", price: 0, slug: "aadhaar-services", type: "page" },
    { name: "Driving Licence Services", price: 0, slug: "dl-services", type: "page" },
    { name: "Voter Services", price: 0, slug: "voter-services", type: "page" },
    { name: "Pan Services", price: 0, slug: "pan-services" },


    // ===== Direct Pages =====
    { name: "UID to Aadhaar PDF", price: 200, slug: "uid-to-aadhaar", type: "direct" },
    { name: "EID to UID", price: 750, slug: "eid-to-uid", type: "direct" },
    { name: "LMS Certificate", price: 1000, slug: "lms-certificate", type: "direct" },
    { name: "Aadhaar PAN Status", price: 10, slug: "aadhaar-pan-status", type: "direct" },
    { name: "Vehicle Services", price: 0, slug: "vehicle-services" }


  ];

  /* ================= CLICK HANDLER ================= */

  const handleClick = (service) => {

    if (!service.slug) {
      alert("Service not available");
      return;
    }

    // Category Based Full Pages
    if (service.type === "page") {
      navigate(`/${service.slug}`);
      return;
    }

    // Direct standalone pages
    if (service.type === "direct") {
      navigate(`/${service.slug}`);
      return;
    }

    if (service.slug === "vehicle-services") {
      navigate("/vehicle-services");
      return;
    }
    if (service.slug === "pan-services") {
      navigate("/pan-services");
      return;
    }


    // Default dynamic form
    navigate(`/service/${service.slug}`);
  };

  /* ================= UI ================= */

  return (
    <div className="dashboard-layout">

      <Sidebar />

      <div className="main-content">

        <Topbar />

        <div className="page-title">
          <h2>Government Services</h2>
        </div>

        <div className="govt-grid">

          {services.map((service) => (

            <div
              key={service.slug}
              className="govt-card"
              onClick={() => handleClick(service)}
            >

              <div className="govt-icon">
                {service.name.charAt(0)}
              </div>

              <h4>{service.name}</h4>

              {service.price > 0 ? (
                <>
                  <div className="manual-badge">
                    Manual Application
                  </div>

                  <h3>₹{service.price.toFixed(2)}</h3>
                  <p>Per Application</p>

                  <span className="time">
                    Within 24 Hours
                  </span>
                </>
              ) : (
                <div className="category-badge">
                  Open Services
                </div>
              )}

            </div>

          ))}

        </div>

      </div>

    </div>
  );
}