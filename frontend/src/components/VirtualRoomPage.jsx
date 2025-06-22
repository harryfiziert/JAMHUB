// src/components/VirtualRoomPage.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "http://localhost:8000"; // ggf. anpassen

const VirtualRoomPage = () => {
    const [rooms, setRooms] = useState([]);
    const navigate = useNavigate();
    const userId = localStorage.getItem("userId"); // Login-ID hier verwenden

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

// styles (gleich wie bisher)
const styles = { /* ... bleibt wie du es hast ... */ };

export default VirtualRoomPage;
