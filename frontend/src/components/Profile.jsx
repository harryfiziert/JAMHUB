import React, { useEffect, useState } from "react";
import { auth } from "../Firebase";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      setUser(currentUser);

      // Hole Profildaten vom Backend
      fetch(`http://localhost:8000/user/${currentUser.uid}`)
        .then((res) => res.json())
        .then((data) => {
          setUserData(data);
        })
        .catch((error) => {
          console.error("Error fetching profile:", error);
        });
    }
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {user && userData ? (
        <div>
          <p><strong>Email:</strong> {userData.email}</p>
          <p><strong>Username:</strong> {userData.username}</p>
          <p><strong>University:</strong> {userData.university}</p>
          <p><strong>UID:</strong> {userData.uid}</p>
        </div>
      ) : (
        <p>Loading user profile...</p>
      )}
    </div>
  );
};

export default Profile;
