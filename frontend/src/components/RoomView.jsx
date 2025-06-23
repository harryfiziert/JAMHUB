import React from "react";
import { useParams } from "react-router-dom";
import Upload from "./Upload";
import Flashcards from "./Flashcard";
import ProgressTracker from "./ProgressTracker";

const RoomView = () => {
    const { roomId } = useParams();
    const userId = localStorage.getItem("userId");

    return (
        <div style={styles.wrapper}>
            <h2 style={styles.heading}>📚 Raum: {roomId}</h2>

            <ProgressTracker userId={userId} roomId={roomId} />

            <Upload roomId={roomId} />
            <hr style={styles.hr} />
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
        color: "var(--text-color)",
    },
    hr: {
        margin: "40px 0",
        borderColor: "var(--border-color)",
    },
};

export default RoomView;
