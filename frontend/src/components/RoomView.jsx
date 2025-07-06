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

    useEffect(() => {
        fetch(`http://localhost:8000/room/${roomId}`)
            .then((res) => res.json())
            .then((data) => setRoomData(data))
            .catch((err) => console.error("Fehler beim Laden des Raums:", err));
    }, [roomId]);

    const [refreshKey, setRefreshKey] = useState(0);

    const checkFlashcards = () => {
        console.log("checkFlashcards triggered");
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
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <h2 style={styles.heading}>Raum: {roomId}</h2>

                {roomData && roomData.owner !== userId && (
                    <button
                        onClick={handleLeaveRoom}
                        style={{
                            backgroundColor: "#dc3545",
                            color: "white",
                            padding: "8px 16px",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                    >
                        Raum verlassen
                    </button>
                )}
            </div>

            <ProgressTracker userId={userId} roomId={roomId} key={`progress-${refreshKey}`} />
            <Upload roomId={roomId} onUploadSuccess={checkFlashcards} />
            {hasFlashcards && (
                <div>
                    <button onClick={handleStartLearning}>Lernen starten</button>
                    <button onClick={handleStartExam}>Prüfung starten</button>
                </div>
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
        marginBottom: "30px",
        fontSize: "24px",
        fontWeight: "bold",
    },
    learnButton: {
        padding: "10px 20px",
        backgroundColor: "#4CAF50",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    examButton: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },
    hr: {
        margin: "40px 0",
        borderColor: "var(--border-color)",
    }
};

export default RoomView;
