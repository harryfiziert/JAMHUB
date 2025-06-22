// src/components/VirtualRoomActions.jsx
import React, { useState } from "react";

const API_BASE = "http://localhost:8000"; // <-- Backend-Adresse 

const VirtualRoomActions = () => {
    const [mode, setMode] = useState("create");
    const [roomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(null);

    const creatorId = localStorage.getItem("userId");

    // Raum erstellen über FastAPI
    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/room`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    creator_id: creatorId,
                    title: roomName,
                    description: "", // optional erweiterbar
                    password: password
                })
            });

            const data = await res.json();
            if (res.ok) {
                setStatus(`✅ Raum '${roomName}' erfolgreich erstellt (ID: ${data.id})`);
                setRoomName("");
                setPassword("");
            } else {
                setStatus("❌ Fehler beim Erstellen: " + data.detail);
            }
        } catch (error) {
            console.error("Fehler beim Erstellen des Raums:", error);
            setStatus("❌ Netzwerkfehler beim Erstellen");
        }
    };

    // Raum beitreten über FastAPI
    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            const res = await fetch(`${API_BASE}/room/${roomId}`);
            const data = await res.json();

            if (res.ok) {
                if (data.password === password) {
                    // jetzt User zum Raum hinzufügen
                    const addUserRes = await fetch(`${API_BASE}/room/${roomId}/add-user/${creatorId}`, {
                        method: "POST"
                    });
                    const addUserData = await addUserRes.json();

                    if (addUserRes.ok) {
                        setStatus("✅ Beitritt erfolgreich!");
                    } else {
                        setStatus("⚠️ Beigetreten, aber User nicht hinzugefügt: " + addUserData.message);
                    }
                } else {
                    setStatus("❌ Falsches Passwort");
                }
            } else {
                setStatus("❌ Raum nicht gefunden");
            }
        } catch (error) {
            console.error("Fehler beim Beitritt:", error);
            setStatus("❌ Netzwerkfehler beim Beitritt");
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.tabButtons}>
                <button
                    style={mode === "create" ? styles.activeButton : styles.button}
                    onClick={() => setMode("create")}
                >
                    Raum erstellen
                </button>
                <button
                    style={mode === "join" ? styles.activeButton : styles.button}
                    onClick={() => setMode("join")}
                >
                    Raum beitreten
                </button>
            </div>

            {mode === "create" ? (
                <form onSubmit={handleCreate} style={styles.form}>
                    <label style={styles.label}>Raum-Name:</label>
                    <input
                        type="text"
                        value={roomName}
                        onChange={(e) => setRoomName(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <label style={styles.label}>Passwort für neuen Raum:</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.submitButton}>Erstellen</button>
                </form>
            ) : (
                <form onSubmit={handleJoin} style={styles.form}>
                    <label style={styles.label}>Raum-ID:</label>
                    <input
                        type="text"
                        value={roomId}
                        onChange={(e) => setRoomId(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <label style={styles.label}>Raum-Passwort:</label>
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        style={styles.input}
                        required
                    />
                    <button type="submit" style={styles.submitButton}>Beitreten</button>
                </form>
            )}

            {status && <p style={{ marginTop: "20px", fontWeight: "bold" }}>{status}</p>}
        </div>
    );
};

const styles = {
    container: {
        padding: "40px",
        maxWidth: "500px",
        margin: "0 auto",
        backgroundColor: "#f9f9f9",
        borderRadius: "12px",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)",
    },
    tabButtons: {
        display: "flex",
        marginBottom: "20px",
        gap: "10px",
    },
    button: {
        flex: 1,
        padding: "10px",
        backgroundColor: "#eee",
        border: "1px solid #ccc",
        cursor: "pointer",
        borderRadius: "6px",
    },
    activeButton: {
        flex: 1,
        padding: "10px",
        backgroundColor: "#1e1e2f",
        color: "white",
        border: "none",
        cursor: "pointer",
        borderRadius: "6px",
    },
    form: {
        display: "flex",
        flexDirection: "column",
        gap: "16px",
    },
    label: {
        fontWeight: "bold",
    },
    input: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #ccc",
        fontSize: "14px",
    },
    submitButton: {
        padding: "10px",
        backgroundColor: "#1e1e2f",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
    },
};

export default VirtualRoomActions;
