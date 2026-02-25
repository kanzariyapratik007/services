import { BrowserRouter, Routes, Route } from "react-router-dom";

import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import GovtServices from "./pages/GovtServices";
import ServiceForm from "./pages/ServiceForm";
import Wallet from "./pages/Wallet";
import WalletTransactions from "./pages/WalletTransactions";
import TransactionDetails from "./pages/TransactionDetails";
import PrintServices from "./pages/PrintServices";
import LinkMobileForm from "./pages/LinkMobileForm";
import LinkMobileList from "./pages/LinkMobileList";
import RationServices from "./pages/RationServices";
import ServiceHistory from "./pages/ServiceHistory";
import ManualService from "./pages/ManualService";
import RationToAadhaarForm from "./pages/RationToAadhaarForm";
import ProfileSettings from "./pages/ProfileSettings";
import VoterServices from "./pages/VoterServices";
import AadhaarServices from "./pages/AadhaarServices";
import UidToAadhaar from "./pages/UidToAadhaar";
import EidToUid from "./pages/EidToUid";
import LmsCertificate from "./pages/LmsCertificate";
import DLServices from "./pages/DLServices";
import ProtectedRoute from "./components/ProtectedRoute";
import VehicleServices from "./pages/VehicleServices";
import PanServices from "./pages/PanServices";

function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* ================= PROTECTED ROUTES ================= */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
  path="/pan-services"
  element={
    <ProtectedRoute>
      <PanServices />
    </ProtectedRoute>
  }
/>
        <Route
  path="/vehicle-services"
  element={
    <ProtectedRoute>
      <VehicleServices />
    </ProtectedRoute>
  }
/>

        <Route
          path="/govt-services"
          element={
            <ProtectedRoute>
              <GovtServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet"
          element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          }
        />

        <Route
          path="/wallet-transactions"
          element={
            <ProtectedRoute>
              <WalletTransactions />
            </ProtectedRoute>
          }
        />
        <Route
  path="/dl-services"
  element={
    <ProtectedRoute>
      <DLServices />
    </ProtectedRoute>
  }
/>

        <Route
          path="/transaction-details"
          element={
            <ProtectedRoute>
              <TransactionDetails />
            </ProtectedRoute>
          }
        />

        <Route
          path="/print-services"
          element={
            <ProtectedRoute>
              <PrintServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/link-mobile"
          element={
            <ProtectedRoute>
              <LinkMobileForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/link-mobile-list"
          element={
            <ProtectedRoute>
              <LinkMobileList />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ration-services"
          element={
            <ProtectedRoute>
              <RationServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ration-to-aadhaar"
          element={
            <ProtectedRoute>
              <RationToAadhaarForm />
            </ProtectedRoute>
          }
        />

        <Route
          path="/aadhaar-services"
          element={
            <ProtectedRoute>
              <AadhaarServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/uid-to-aadhaar"
          element={
            <ProtectedRoute>
              <UidToAadhaar />
            </ProtectedRoute>
          }
        />

        <Route
          path="/eid-to-uid"
          element={
            <ProtectedRoute>
              <EidToUid />
            </ProtectedRoute>
          }
        />

        <Route
          path="/lms-certificate"
          element={
            <ProtectedRoute>
              <LmsCertificate />
            </ProtectedRoute>
          }
        />

        <Route
          path="/voter-services"
          element={
            <ProtectedRoute>
              <VoterServices />
            </ProtectedRoute>
          }
        />

        <Route
          path="/manual-service"
          element={
            <ProtectedRoute>
              <ManualService />
            </ProtectedRoute>
          }
        />

        <Route
          path="/service-history"
          element={
            <ProtectedRoute>
              <ServiceHistory />
            </ProtectedRoute>
          }
        />

        <Route
          path="/profile-settings"
          element={
            <ProtectedRoute>
              <ProfileSettings />
            </ProtectedRoute>
          }
        />

        {/* ================= DYNAMIC SERVICE ROUTE ================= */}
        <Route
          path="/service/:serviceSlug"
          element={
            <ProtectedRoute>
              <ServiceForm />
            </ProtectedRoute>
          }
        />

      </Routes>
    </BrowserRouter>
  );
}

export default App;