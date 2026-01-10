import React, { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import "./Profile.css"

const Profile = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch logged-in user & profile data
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/"); // redirect to landing page if not logged in
      } else {
        try {
          const docRef = doc(db, "users", user.uid);
          const snap = await getDoc(docRef);

          if (snap.exists()) {
            setUserData(snap.data());
          } else {
            // fallback if Firestore doc doesn't exist
            setUserData({
              name: user.displayName || "User",
              email: user.email,
              createdAt: user.metadata?.creationTime,
              accountType: "User",
            });
          }
        } catch (err) {
          console.error("Failed to fetch profile data", err);
        } finally {
          setLoading(false);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) return <div className="profile-page">Loading...</div>;

  return (
    <div className="profile-page">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div className="profile-avatar">
            {userData?.name?.charAt(0).toUpperCase()}
          </div>
          <div className="profile-basic-info">
            <h2>{userData?.name}</h2>
            <p>{userData?.email}</p>
          </div>
        </div>

        {/* Divider */}
        <div className="divider"></div>

        {/* Details */}
        <div className="profile-details">
          <div className="detail-item">
            <span className="label">Full Name</span>
            <span className="value">{userData?.name}</span>
          </div>

          <div className="detail-item">
            <span className="label">Email</span>
            <span className="value">{userData?.email}</span>
          </div>

          <div className="detail-item">
            <span className="label">Account Type</span>
            <span className="value">{userData?.accountType || "User"}</span>
          </div>

          <div className="detail-item">
            <span className="label">Joined On</span>
            <span className="value">
              {userData?.createdAt
                ? new Date(userData.createdAt).toDateString()
                : "N/A"}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="profile-actions">
          <button
            className="edit-btn"
            onClick={() => navigate("/edit-profile")}
          >
            Edit Profile
          </button>
          <button
            className="change-btn"
            onClick={() => navigate("/change-password")}
          >
            Change Password
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
