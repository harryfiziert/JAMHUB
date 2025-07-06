import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Upload from "./Upload";
import Flashcards from "./Flashcard";
import ProgressTracker from "./ProgressTracker";
import Leaderboard from "./Leaderboard";
import RoomDiagram from "./RoomDiagram";

const RoomView = () => {
    const { roomId } = useParams();
    const userId = localStorage.getItem("userId");
    const [hasFlashcards, setHasFlashcards] = useState(false);
    const [roomData, setRoomData] = useState(null);
    const navigate = useNavigate();
    const [refreshKey, setRefreshKey] = useState(0);

    useEffect(() => {
        fetch(`http://localhost:8000/room/${roomId}`)
            .then((res) => res.json())
            .then((data) => setRoomData(data))
            .catch((err) => console.error("Fehler beim Laden des Raums:", err));
    }, [roomId]);

    const checkFlashcards = () => {
        fetch(`http://localhost:8000/flashcards/by-room-and-user/${roomId}/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setHasFlashcards(data.length > 0);
                setRefreshKey(prev => prev + 1);
            })
            .catch((err) => console.error("Fehler beim Laden der Flashcards:", err));
    };

    useEffect(() => {
        checkFlashcards();
    }, [roomId, userId]);

    const handleStartLearning = () => {
        navigate(`/learn/${roomId}`);
    };

    const handleStartExam = () => {
        navigate(`/exam/${roomId}`);
    };

    const handleLeaveRoom = async () => {
        if (!window.confirm("Möchtest du diesen Raum wirklich verlassen?")) return;

        try {
            const res = await fetch(`http://localhost:8000/room/${roomId}/remove-user/${userId}`, {
                method: "DELETE"
            });

            if (res.ok) {
                alert("Du hast den Raum verlassen.");
                navigate("/rooms", { replace: true });
            } else {
                alert("Fehler beim Verlassen des Raums.");
            }
        } catch (error) {
            console.error("Fehler:", error);
            alert("Verbindungsfehler.");
        }
    };

    return (
        <div style={styles.wrapper}>
            {/* Raumtitel + Steuerbereich */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "30px" }}>
                <div>
                    <h2 style={styles.heading}>{roomData?.title || "Raum"}</h2>
                    <p style={{ fontSize: "14px", color: "gray" }}>ID: {roomId}</p>
                </div>

                <div>
                    {roomData && roomData.creator_id === userId && (
                        <span style={{ fontSize: "14px", color: "#4CAF50", fontWeight: "bold" }}>
                            Du bist Besitzer dieses Raums
                        </span>
                    )}
                    {roomData && roomData.creator_id !== userId && (
                        <button onClick={handleLeaveRoom} style={styles.leaveButton}>
                            Raum verlassen
                        </button>
                    )}
                </div>
            </div>

            <ProgressTracker userId={userId} roomId={roomId} key={`progress-${refreshKey}`} />
            <hr style={styles.hr} />
            <Upload roomId={roomId} onUploadSuccess={checkFlashcards} />
            <hr style={styles.hr} />

            {hasFlashcards && (
                <>
                    <div style={{ display: "flex", justifyContent: "center", gap: "24px", marginBottom: "32px" }}>
                        <button style={styles.learnButton} onClick={handleStartLearning}>
                            Lernen starten
                        </button>
                        <button style={styles.examButton} onClick={handleStartExam}>
                            Prüfung starten
                        </button>
                    </div>
                    <hr style={styles.hr} />
                </>
            )}

            <Flashcards roomId={roomId} key={`flashcards-${refreshKey}`} />
            <Leaderboard roomId={roomId} key={`leaderboard-${refreshKey}`} />
            <RoomDiagram roomId={roomId} refreshKey={refreshKey} />
        </div>
    );
};

const styles = {
    wrapper: {
        padding: "40px",
        maxWidth: "900px",
        margin: "0 auto",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        borderRadius: "12px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.05)",
    },
    heading: {
        margin: 0,
        fontSize: "28px",
        fontWeight: "bold",
    },
    learnButton: {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
    },
    examButton: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "8px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "bold",
        boxShadow: "0 2px 6px rgba(0, 0, 0, 0.1)"
    },
    leaveButton: {
        backgroundColor: "#dc3545",
        color: "white",
        padding: "8px 16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontWeight: "bold"
    },
    hr: {
        margin: "40px 0",
        border: "none",
        borderTop: "1px solid #444"
    }
};

export default RoomView;
