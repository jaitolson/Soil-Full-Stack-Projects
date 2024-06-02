import React, { useState, useEffect } from "react";
import "../styles/profile.css";
import { useNavigate } from 'react-router-dom';
import { getUser, getEmail, updateUser, logout, deleteProfile } from '../services/api';

function MyProfile({ logInUser }) {
  const navigate = useNavigate();

  const [user, setUser] = useState({
    name: "",
    email: "",
    userID: "",
    joinDate: ""
  });

  const [editedUser, setEditedUser] = useState({
    name: "",
    email: "",
    userID: "",
    joinDate: ""
  });

  useEffect(() => {
    const fetchData = async (email) => {
      try {
        console.log("Fetching user data for email:", email);
        const userData = await getUser(email);
        console.log("Fetched user data:", userData);
        if (userData) {
          setUser({
            name: userData.name,
            email: userData.email,
            userID: userData.userID,
            joinDate: userData.createdAt // Set joinDate from createdAt field
          });
          setEditedUser({
            name: userData.name,
            email: userData.email,
            userID: userData.userID,
            joinDate: userData.createdAt // Set joinDate from createdAt field
          });
          console.log("User and editedUser states updated with joinDate:", userData.createdAt);
        } else {
          console.log("User not found.");
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
      }
    };

    const email = getEmail(); // Fetch email only once
    console.log("Fetched email:", email);
    if (email) {
      fetchData(email);
    }
  }, []); // Empty dependency array ensures the effect runs only once

  const handleEdit = (field, value) => {
    setEditedUser(prevUser => ({
      ...prevUser,
      [field]: value
    }));
  };

  const handleSave = () => {
    console.log("Saving user data:", editedUser);
    updateUser(user.userID, editedUser)
      .then(() => {
        setUser(editedUser);
        document.cookie = `user=${editedUser.email}; expires=Thu, 18 Dec 2030 12:00:00 UTC; path=/`;
        console.log("User data updated successfully.");
      })
      .catch(error => {
        console.error('Error updating user data:', error);
      });
  };

  const handleDeleteProfile = () => {
    console.log("Deleting profile for user ID:", user.userID);
    deleteProfile(user.userID)
      .then(() => {
        logInUser(false);
        document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        navigate('/');
        console.log("Profile deleted successfully.");
      })
      .catch(error => {
        console.error('Error deleting profile:', error);
      });
  };

  const handleLogOutUser = () => {
    console.log("Logging out user.");
    logInUser(false);
    document.cookie = "user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    navigate('/');
  };

  return (
    <div className="profile-container">
      <div className="profile-content">
        <h2 className="profile-title">User Profile</h2>
        <div className="profile-field">
          <label className="profile-label">Username</label>
          <input
            type="text"
            name="name"
            value={editedUser.name}
            onChange={(e) => handleEdit("name", e.target.value)}
            className="profile-input"
          />
        </div>
        <div className="profile-field">
          <label className="profile-label">Email</label>
          <input
            type="email"
            name="email"
            value={editedUser.email}
            onChange={(e) => handleEdit("email", e.target.value)}
            className="profile-input"
          />
        </div>
        <div className="profile-field">
          <label className="profile-label">Join Date</label>
          <p className="profile-text">{new Date(user.joinDate).toLocaleDateString()}</p> {/* Display formatted join date */}
        </div>
        <button onClick={handleSave} className="profile-button">
          Save
        </button>
        <button onClick={handleLogOutUser} className="profile-button">
          Logout
        </button>
      </div>
      <button onClick={handleDeleteProfile} className="profile-button delete-button">
        Delete Profile
      </button>
    </div>
  );
}

export default MyProfile;
