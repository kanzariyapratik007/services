import { useEffect, useState } from "react";
import Sidebar from "../components/Sidebar";
import Topbar from "../components/Topbar";
import API from "../api";
import "../styles/profile.css";

export default function ProfileSettings() {

  const [profile, setProfile] = useState({});
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    API.get("profile/")
      .then(res => setProfile(res.data))
      .catch(err => console.log(err));
  }, []);

  const handleUpdate = async () => {
    try {
      await API.put("profile/", {
        first_name: profile.full_name.split(" ")[0],
        last_name: profile.full_name.split(" ")[1] || "",
        email: profile.email
      });

      setMessage("✅ Profile updated successfully");

    } catch {
      setMessage("❌ Update failed");
    }
  };

  const handlePasswordChange = async () => {

    if (!currentPassword || !newPassword) {
      alert("Fill password fields");
      return;
    }

    try {
      await API.post("change-password/", {
        current_password: currentPassword,
        new_password: newPassword
      });

      setMessage("✅ Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");

    } catch (err) {
      setMessage(err.response?.data?.error || "Error changing password");
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar />

      <div className="main-content">
        <Topbar />

        <div className="profile-page">

          <h2>Profile Settings</h2>

          {message && <p className="profile-msg">{message}</p>}

          <div className="profile-container">

            {/* LEFT FORM */}
            <div className="profile-form">

              <label>Full Name</label>
              <input
                value={profile.full_name || ""}
                onChange={(e) =>
                  setProfile({ ...profile, full_name: e.target.value })
                }
              />

              <label>Email</label>
              <input
                value={profile.email || ""}
                onChange={(e) =>
                  setProfile({ ...profile, email: e.target.value })
                }
              />

              <button className="save-btn" onClick={handleUpdate}>
                Save Changes
              </button>

              <hr />

              <h3>Change Password</h3>

              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />

              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />

              <button className="save-btn" onClick={handlePasswordChange}>
                Update Password
              </button>

            </div>

            {/* RIGHT INFO */}
            <div className="profile-info">
              <h3>Account Info</h3>
              <p><b>Username:</b> {profile.username}</p>
              <p><b>Email:</b> {profile.email}</p>
              <p><b>Status:</b> Active</p>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}