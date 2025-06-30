import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function LearnView() {
    const { roomId } = useParams();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userId, setUserId] = useState("");

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);

        if (storedUserId) {
            fetch(`/flashcards/to-learn/${storedUserId}/${roomId}`)
                .then((res) => res.json())
                .then((data) => setCards(data));
        }
    }, [roomId]);

    const handleNext = () => {
        setShowAnswer(false);
        setCurrentIndex((prevIndex) => (prevIndex + 1) % cards.length);
    };

    const handlePrevious = () => {
        setShowAnswer(false);
        setCurrentIndex((prevIndex) =>
            (prevIndex - 1 + cards.length) % cards.length
        );
    };

    const handleMarkAsLearned = async () => {
        const currentCard = cards[currentIndex];
        // console.log("currentCard", currentCard);
        // console.log("currentCard._id:", currentCard._id);
        await fetch(`/flashcards/${currentCard._id.$oid}/mark-learned`, {
            method: "PATCH",
        });


        const updatedCards = cards.filter((_, i) => i !== currentIndex);
        setCards(updatedCards);
        setShowAnswer(false);
        setCurrentIndex(0);
    };

    if (cards.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "1.5rem" }}>
                Alle Karten gelernt 🎉
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "80vh",
                backgroundColor: "var(--background-color, #1e1e1e)",
                color: "var(--text-color, #fff)",
            }}
        >
            <div
                style={{
                    backgroundColor: "#2a2a2a",
                    border: "1px solid #444",
                    borderRadius: "12px",
                    padding: "2rem",
                    maxWidth: "600px",
                    width: "90%",
                    boxShadow: "0 0 10px rgba(0, 0, 0, 0.5)",
                }}
            >
                <h3 style={{ marginBottom: "0.5rem" }}>Frage</h3>
                <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>{currentCard.question}</p>

                {showAnswer && (
                    <>
                        <h4>Antwort</h4>
                        <p style={{ background: "#3a3a3a", padding: "1rem", borderRadius: "8px" }}>
                            {currentCard.answer}
                        </p>
                    </>
                )}

                <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
                    <button onClick={handlePrevious}>◀ Vorherige</button>
                    <button onClick={() => setShowAnswer(!showAnswer)}>
                        {showAnswer ? "Antwort ausblenden" : "Antwort anzeigen"}
                    </button>
                    <button onClick={handleNext}>Nächste ▶</button>
                </div>

                <div style={{ marginTop: "1rem", textAlign: "center" }}>
                    <button onClick={handleMarkAsLearned}>✅ Als gelernt markieren</button>
                </div>

                <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
                    Karte {currentIndex + 1} / {cards.length}
                </p>
            </div>
        </div>
    );
}

export default LearnView;
