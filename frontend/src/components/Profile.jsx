import React, { useEffect, useState } from "react";
import { auth } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
  
        try {
          const res = await fetch(`http://localhost:8000/user/${currentUser.uid}`);
          if (!res.ok) throw new Error("User not found");
  
          const data = await res.json();
          setUserData(data);
        } catch (err) {
          console.error("Error fetching profile:", err.message);
        }
      }
    });
  
    return () => unsubscribe();
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
