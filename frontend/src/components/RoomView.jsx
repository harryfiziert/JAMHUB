import React from "react";
import { useParams } from "react-router-dom";
import Upload from "./Upload";
import Flashcards from "./Flashcard";

const RoomView = () => {
    const { roomId } = useParams();

    return (
        <div style={{ padding: "40px", maxWidth: "900px", margin: "0 auto" }}>
            <h2 style={{ marginBottom: "30px" }}>📚 Raum: {roomId}</h2>

            <Upload roomId={roomId} />
            <hr style={{ margin: "40px 0" }} />
            <Flashcards roomId={roomId} />
        </div>
    );
};

export default RoomView;
