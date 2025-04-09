import React, { useEffect, useState } from "react";
import { auth } from "../Firebase";
import { onAuthStateChanged } from "firebase/auth";

const Profile = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Listen to auth changes
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup
    return () => unsubscribe();
  }, []);

  return (
    <div>
      <h2>Profile</h2>
      {user ? (
        <div>
          <p><strong>Email:</strong> {user.email}</p>
          <p><strong>User ID:</strong> {user.uid}</p>
        </div>
      ) : (
        <p>No user is currently logged in.</p>
      )}
    </div>
  );
};

export default Profile;
