import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Upload from "./Upload";
import Flashcards from "./Flashcard";
import ProgressTracker from "./ProgressTracker";
import Leaderboard from "./Leaderboard";

const RoomView = () => {
    const { roomId } = useParams();
    const userId = localStorage.getItem("userId");
    const [hasFlashcards, setHasFlashcards] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        console.log("2")

        fetch(`http://localhost:8000/flashcards/by-room-and-user/${roomId}/${userId}`)
            .then((res) => res.json())
            .then((data) => setHasFlashcards(data.length > 0))
            .catch((err) => console.error("Fehler beim Laden der Flashcards:", err));
    }, [roomId, userId]);


    const handleStartLearning = () => {
        navigate(`/learn/${roomId}`);
    };

    const handleStartExam = () => {
        navigate(`/exam/${roomId}`);
    };


    return (
        <div style={styles.wrapper}>
            <h2 style={styles.heading}>📚 Raum: {roomId}</h2>

            <ProgressTracker userId={userId} roomId={roomId} />
            <Upload roomId={roomId} />

            <hr style={styles.hr} />

            {hasFlashcards && (
                <div style={{ display: "flex", gap: "10px" }}>
                    <button onClick={handleStartLearning} style={styles.learnButton}>
                        Lernen starten
                    </button>
                    <button onClick={handleStartExam} style={styles.examButton}>
                        Prüfung starten
                    </button>
                </div>
            )}


            <Flashcards roomId={roomId} />

            <Leaderboard roomId={roomId} />

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
    examButton: {
        padding: "10px 20px",
        backgroundColor: "#007bff",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
    },

};

export default RoomView;
