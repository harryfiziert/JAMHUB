import React, { useState, useEffect } from "react";
import { auth } from "../Firebase";
import profilePic from "../assets/react.svg";
import { EmailAuthProvider, reauthenticateWithCredential, updateEmail } from "firebase/auth";


const Settings = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [university, setUniversity] = useState("");
  const [password, setPassword] = useState("");
  const [profileImage, setProfileImage] = useState(null);
  const [message, setMessage] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");

  // Daten beim Laden holen
  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      if (!currentUser) return;

      try {
        const res = await fetch(`http://localhost:8000/user/${currentUser.uid}`);
        const data = await res.json();
        setUsername(data.username || "");
        setEmail(data.email || "");
        setUniversity(data.university || "");
      } catch (error) {
        console.error("Fehler beim Laden:", error);
      }
    };

    fetchUserData();
  }, []);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUser = auth.currentUser;
    if (!currentUser) return;
  
    setMessage("");
  
    // 1. E-Mail in Firebase aktualisieren (inkl. Reauthentifizierung)
    try {
      if (currentUser.email !== email) {
        if (!currentPassword) {
            setMessage("Bitte gib dein aktuelles Passwort ein, um die E-Mail zu ändern.");
            return;
          }
          
          const credential = EmailAuthProvider.credential(currentUser.email, currentPassword);
  
        await reauthenticateWithCredential(currentUser, credential);
        await updateEmail(currentUser, email);
        console.log("✅ Firebase E-Mail aktualisiert.");
      }
    } catch (error) {
      console.error("❌ Fehler beim E-Mail-Update:", error);
  
      if (error.code === "auth/wrong-password") {
        setMessage("Falsches Passwort. Bitte versuche es erneut.");
      } else if (error.code === "auth/invalid-email") {
        setMessage("Ungültige neue E-Mail-Adresse.");
      } else if (error.code === "auth/requires-recent-login") {
        setMessage("Bitte logge dich erneut ein, um die E-Mail zu ändern.");
      } else {
        setMessage("E-Mail-Update fehlgeschlagen: " + error.message);
      }
      return;
    }
  
    // 2. Update in MongoDB
    try {
      const res = await fetch(`http://localhost:8000/user/update/${currentUser.uid}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          university,
        }),
      });
  
      if (!res.ok) throw new Error("Update in Datenbank fehlgeschlagen.");
      setMessage("✅ Änderungen erfolgreich gespeichert.");
    } catch (error) {
      console.error("❌ MongoDB Update Error:", error);
      setMessage("Fehler beim Speichern in der Datenbank.");
    }
  };

  return (
    <div style={styles.container}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={styles.header}>Kontoeinstellungen</h2>

        <label style={styles.label}>Benutzername</label>
        <input
          style={styles.input}
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label style={styles.label}>E-Mail-Adresse</label>
        <input
          style={styles.input}
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <label style={styles.label}>Universität</label>
        <input
          style={styles.input}
          type="text"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
        />

        <label style={styles.label}>Aktuelles Passwort (zur Bestätigung)</label>
        <input
         style={styles.input}
    type="password"
    value={currentPassword}
    onChange={(e) => setCurrentPassword(e.target.value)}
    placeholder="Benötigt für E-Mail-Änderung"
       />

    <label style={styles.label}>Neues Passwort (optional)</label>
    <input
    style={styles.input}
    type="password"
    value={password}
    onChange={(e) => setPassword(e.target.value)}
    placeholder="Noch nicht aktiv"
    />

        <label style={styles.label}>Profilbild</label>
        <div style={styles.profileImageRow}>
          <img
            src={profileImage || profilePic}
            alt="Profilvorschau"
            style={styles.avatar}
          />
          <input type="file" onChange={handleProfileImageChange} disabled />
        </div>

        <button type="submit" style={styles.button}>
          Änderungen speichern
        </button>

        {message && <p style={styles.message}>{message}</p>}
      </form>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    padding: "40px",
  },
  form: {
    backgroundColor: "#f4f4f4",
    padding: "30px",
    borderRadius: "12px",
    width: "100%",
    maxWidth: "400px",
    boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
  },
  header: {
    marginBottom: "24px",
    fontSize: "20px",
    color: "#1a2b4c",
  },
  label: {
    display: "block",
    marginBottom: "6px",
    marginTop: "16px",
    fontSize: "14px",
    color: "#333",
  },
  input: {
    width: "100%",
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "14px",
  },
  profileImageRow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginTop: "8px",
  },
  avatar: {
    width: "60px",
    height: "60px",
    borderRadius: "50%",
    objectFit: "cover",
    border: "2px solid #ccc",
  },
  button: {
    marginTop: "24px",
    padding: "10px 20px",
    backgroundColor: "#1e1e2f",
    color: "white",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
  },
  message: {
    marginTop: "16px",
    color: "green",
  },
};

export default Settings;
