import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000"; // ggf. anpassen

const VirtualRoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const res = await fetch(`${API_BASE}/rooms/by-user/${userId}`);
                const data = await res.json();
                if (res.ok) {
                    setRooms(data);
                } else {
                    console.error("Fehler beim Laden der Räume:", data.detail);
                }
            } catch (err) {
                console.error("Netzwerkfehler:", err);
            }
        };

        if (userId) fetchRooms();
    }, [userId]);

    const handleEnterRoom = (roomId) => {
        navigate(`/room/${roomId}`);
    };

    const handleDeleteRoom = async (roomId, roomName) => {
        if (!window.confirm(`Möchtest du den Raum "${roomName}" wirklich löschen?`)) return;

        try {
            const res = await fetch(`${API_BASE}/room/${roomId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                setRooms(rooms.filter((r) => r.id !== roomId));
                console.log(`Raum mit ID ${roomId} wurde gelöscht`);
            } else {
                console.error("Löschen fehlgeschlagen:", await res.text());
            }
        } catch (err) {
            console.error("Netzwerkfehler beim Löschen:", err);
        }
    };

    return (
        <div style={styles.wrapper}>
            <div style={styles.container}>
                <h2 style={styles.header}>Meine Räume</h2>

                <div style={styles.actions}>
                    <button
                        style={styles.button}
                        onClick={() => navigate("/room/create", {state: {mode: "create"}})}
                    >
                        + Raum erstellen
                    </button>

                    <button
                        style={styles.button}
                        onClick={() => navigate("/room/join", {state: {mode: "join"}})}
                    >
                        Raum beitreten
                    </button>

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
                                <h3 style={styles.roomName}>{room.title || "(Kein Titel)"}</h3>
                                <p style={styles.roomId}>ID: {room.id}</p>
                            </div>

                            <button
                                style={styles.enterButton}
                                onClick={() => handleEnterRoom(room.id)}
                            >
                                ➤ Anzeigen
                            </button>

                            {room.creator_id === userId && (
                                <button
                                    style={styles.deleteButton}
                                    onClick={() => handleDeleteRoom(room.id, room.title)}
                                >
                                    ❌
                                </button>
                            )}
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
        backgroundColor: "var(--bg-color)",
        minHeight: "100vh",
        maxWidth: "960px",
        width: "100%",
        boxSizing: "border-box",
    },
    header: {
        fontSize: "28px",
        fontWeight: "600",
        marginBottom: "24px",
        color: "var(--text-color)",
    },
    actions: {
        display: "flex",
        gap: "16px",
        marginBottom: "32px",
    },
    button: {
        padding: "12px 20px",
        backgroundColor: "var(--button-bg)",
        color: "var(--text-color)",
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
        backgroundColor: "var(--card-bg)",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.08)",
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        transition: "transform 0.3s ease, box-shadow 0.3s ease",
        position: "relative",
        gap: "15px",
    },
    roomInfo: {
        display: "flex",
        flexDirection: "column",
    },
    roomName: {
        fontSize: "18px",
        fontWeight: "700",
        margin: "0 0 4px 0",
        color: "var(--text-color)",
    },
    roomId: {
        fontSize: "14px",
        color: "var(--text-color)",
        marginTop: "0",
        opacity: 0.7,
    },
    enterButton: {
        padding: "10px 18px",
        backgroundColor: "var(--button-bg)",
        color: "var(--text-color)",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontWeight: "600",
        transition: "background-color 0.2s ease, transform 0.2s ease",
        whiteSpace: "nowrap",
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