import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Upload from "./Upload";
import Flashcards from "./Flashcard";
import ProgressTracker from "./ProgressTracker";

const RoomView = () => {
    const { roomId } = useParams();
    const userId = localStorage.getItem("userId");
    const [hasFlashcards, setHasFlashcards] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`http://localhost:8000/flashcards/by-room/${roomId}`)
            .then((res) => res.json())
            .then((data) => setHasFlashcards(data.length > 0))
            .catch((err) => console.error("Fehler beim Laden der Flashcards:", err));
    }, [roomId]);

    const handleStartLearning = () => {
        navigate(`/learn/${roomId}`);
    };

    return (
        <div style={styles.wrapper}>
            <h2 style={styles.heading}>📚 Raum: {roomId}</h2>

            <ProgressTracker userId={userId} roomId={roomId} />
            <Upload roomId={roomId} />

            <hr style={styles.hr} />

            <div style={styles.flashcardHeader}>
                <h3>Flashcards</h3>
                {hasFlashcards && (
                    <button onClick={handleStartLearning} style={styles.learnButton}>
                        Lernen starten
                    </button>
                )}
            </div>

            <Flashcards roomId={roomId} />
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
    flashcardHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
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
    hr: {
        margin: "40px 0",
        borderColor: "var(--border-color)",
    },
};

export default RoomView;
