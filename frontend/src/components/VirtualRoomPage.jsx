// src/components/VirtualRoomPage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const VirtualRoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchRooms = async () => {
            const snapshot = await getDocs(collection(db, "rooms"));
            const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
            setRooms(data);
        };
        fetchRooms();
    }, []);

    const handleEnterRoom = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h2 style={styles.header}>Virtuelle Räume</h2>

                <div style={styles.actions}>
                    <button style={styles.button} onClick={() => navigate("/room/create")}>➕ Raum erstellen</button>
                    <button style={styles.button} onClick={() => navigate("/room/join")}>🔑 Raum beitreten</button>
                </div>

                <div style={styles.roomGrid}>
                    {rooms.map((room, index) => (
                        <div
                            key={room.id}
                            style={{
                                ...styles.roomCard,
                                animation: `fadeIn 0.4s ease ${index * 0.05}s forwards`,
                                transform: "translateY(20px)",
                                opacity: 0,
                            }}
                        >
                            <div>
                                <h3 style={styles.roomName}>{room.name || "(Kein Name)"}</h3>
                                <p style={styles.roomId}>ID: {room.roomId}</p>
                            </div>
                            <button
                                style={styles.enterButton}
                                onMouseEnter={(e) => (e.currentTarget.style.transform = "scale(1.05)")}
                                onMouseLeave={(e) => (e.currentTarget.style.transform = "scale(1.0)")}
                                onClick={() => handleEnterRoom(room.roomId)}
                            >
                                ➤ Anzeigen
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <style>
                {`
          @keyframes fadeIn {
            to {
              transform: translateY(0);
              opacity: 1;
            }
          }
        `}
            </style>
        </div>
    );
};

const styles = {
    wrapper: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
    },
    container: {
        padding: "40px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f5f5f5",
        minHeight: "100vh",
        maxWidth: "960px",
        width: "100%",
    },
    header: {
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "24px",
        color: "#1e1e2f",
    },
    actions: {
        display: "flex",
        gap: "16px",
        marginBottom: "32px",
    },
    button: {
        padding: "12px 20px",
        backgroundColor: "#1e1e2f",
        color: "white",
        border: "none",
        borderRadius: "10px",
        cursor: "pointer",
        fontSize: "14px",
        transition: "transform 0.2s ease",
    },
    roomGrid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: "24px",
    },
    roomCard: {
        backgroundColor: "white",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "transform 0.3s ease",
    },
    roomName: {
        fontSize: "16px",
        fontWeight: "600",
        margin: 0,
        color: "#333",
    },
    roomId: {
        fontSize: "13px",
        color: "#777",
        marginTop: "4px",
    },
    enterButton: {
        padding: "8px 14px",
        backgroundColor: "#eee",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "bold",
        transition: "transform 0.2s ease",
    },
};

export default VirtualRoomPage;
