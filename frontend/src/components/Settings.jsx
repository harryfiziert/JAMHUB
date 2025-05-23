import React, { useState } from "react";
import profilePic from "../assets/react.svg"; // Fallback Bild

const Settings = () => {
    const [username, setUsername] = useState("GeorgM");
    const [email, setEmail] = useState("georg@example.com");
    const [password, setPassword] = useState("");
    const [profileImage, setProfileImage] = useState(null);

    const handleProfileImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfileImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
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

                <label style={styles.label}>Passwort</label>
                <input
                    style={styles.input}
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Neues Passwort"
                />

                <label style={styles.label}>Profilbild</label>
                <div style={styles.profileImageRow}>
                    <img
                        src={profileImage || profilePic}
                        alt="Profilvorschau"
                        style={styles.avatar}
                    />
                    <input type="file" onChange={handleProfileImageChange} />
                </div>

                <button type="submit" style={styles.button}>
                    Änderungen speichern
                </button>
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
};

export default Settings;
