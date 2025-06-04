// src/components/VirtualRoomPage.jsx
import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
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

    const handleDeleteRoom = async (id, roomName) => {
        if (window.confirm(`Sind Sie sicher, dass Sie den Raum "${roomName}" löschen möchten?`)) {
            try {
                await deleteDoc(doc(db, "rooms", id));
                setRooms(rooms.filter((room) => room.id !== id));
                console.log(`Room with ID: ${id} deleted successfully.`);
            } catch (error) {
                console.error("Error deleting room: ", error);
            }
        }
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
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = "translateY(-5px)";
                                e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.15)";
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = "translateY(0)";
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(0, 0, 0, 0.08)";
                            }}
                        >
                            <div style={styles.roomInfo}>
                                <h3 style={styles.roomName}>{room.name || "(Kein Name)"}</h3>
                                <p style={styles.roomId}>ID: {room.roomId}</p>
                            </div>

                            <button
                                style={styles.enterButton}
                                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = "#2a2a3f")}
                                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = "#1e1e2f")}
                                onClick={() => handleEnterRoom(room.roomId)}
                            >
                                ➤ Anzeigen
                            </button>

                            <button
                                style={styles.deleteButton}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.color = "#ff4d4d";
                                    e.currentTarget.style.transform = "scale(1.1)";
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.color = "#a0a0a0";
                                    e.currentTarget.style.transform = "scale(1)";
                                }}
                                onClick={() => handleDeleteRoom(room.id, room.name)}
                            >
                                ❌
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
        boxSizing: "border-box",
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
        transition: "background-color 0.2s ease, transform 0.2s ease",
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
        justifyContent: "flex-start", // <-- WICHTIGE ÄNDERUNG HIER!
        alignItems: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        position: "relative",
        gap: "15px",
    },
    roomInfo: {
        display: "flex",
        flexDirection: "column",
        // flexGrow: 1, // weiterhin entfernt
    },
    roomName: {
        fontSize: "18px",
        fontWeight: "700",
        margin: "0 0 4px 0",
        color: "#1e1e2f",
    },
    roomId: {
        fontSize: "14px",
        color: "#777",
        marginTop: "0",
    },
    enterButton: {
        padding: "10px 18px",
        backgroundColor: "#1e1e2f",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "background-color 0.2s ease, transform 0.2s ease",
        whiteSpace: "nowrap",
        // marginLeft: "10px", // weiterhin entfernt
    },
    deleteButton: {
        position: "absolute",
        top: "10px",
        right: "10px",
        backgroundColor: "transparent",
        border: "none",
        cursor: "pointer",
        fontSize: "14px",
        color: "#a0a0a0",
        fontWeight: "bold",
        padding: "0",
        lineHeight: "1",
        transition: "color 0.2s ease, transform 0.2s ease",
        zIndex: 1,
    },
};

export default VirtualRoomPage;