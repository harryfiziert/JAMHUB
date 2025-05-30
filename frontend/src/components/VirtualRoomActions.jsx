// src/components/VirtualRoomActions.jsx
import React, { useState } from "react";
import { db } from "../Firebase";
import { collection, addDoc, getDocs, query, where } from "firebase/firestore";

const VirtualRoomActions = () => {
    const [mode, setMode] = useState("create");
    const [roomId, setRoomId] = useState("");
    const [roomName, setRoomName] = useState("");
    const [password, setPassword] = useState("");
    const [status, setStatus] = useState(null);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            const generatedId = crypto.randomUUID().slice(0, 6);
            await addDoc(collection(db, "rooms"), {
                roomId: generatedId,
                name: roomName,
                password,
                createdAt: new Date().toISOString(),
            });
            setStatus(`✅ Raum '${roomName}' erfolgreich erstellt (ID: ${generatedId})`);
            setRoomName("");
            setPassword("");
        } catch (error) {
            console.error("Fehler beim Erstellen des Raums:", error);
            setStatus("❌ Fehler beim Erstellen");
        }
    };

    const handleJoin = async (e) => {
        e.preventDefault();
        try {
            const q = query(
                collection(db, "rooms"),
                where("roomId", "==", roomId),
                where("password", "==", password)
            );
            const snapshot = await getDocs(q);
            if (!snapshot.empty) {
                setStatus("✅ Beitritt erfolgreich!");
            } else {
                setStatus("❌ Ungültige Raum-ID oder Passwort");
            }
        } catch (error) {
            console.error("Fehler beim Beitritt:", error);
            setStatus("❌ Fehler beim Beitritt");
        }
    };

    const handleTestWrite = async () => {
        try {
            const testDocRef = await addDoc(collection(db, "testWrite"), {
                message: "Testeintrag",
                timestamp: new Date().toISOString(),
            });
            alert("✅ Firestore-Test erfolgreich! Dokument-ID: " + testDocRef.id);
        } catch (err) {
            console.error("❌ Firestore-Test fehlgeschlagen:", err);
            alert("❌ Firestore-Test fehlgeschlagen. Siehe Konsole.");
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

            <button onClick={handleTestWrite} style={{
                marginTop: "30px",
                padding: "10px",
                backgroundColor: "#999",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
            }}>
                🔧 Firestore-Test
            </button>
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
