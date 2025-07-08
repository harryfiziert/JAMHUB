import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

function LearnView() {
    const { roomId } = useParams();
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [userId, setUserId] = useState("");

    const difficultyLabel = {
        0: "Leicht",
        1: "Mittel",
        2: "Schwer",
        3: "Falsch"
    };

    useEffect(() => {
        const storedUserId = localStorage.getItem("userId");
        setUserId(storedUserId);

        if (storedUserId) {
            fetch(`/flashcards/to-learn/${storedUserId}/${roomId}`)
                .then((res) => res.json())
                .then((data) => {
                    const sorted = [...data].sort((a, b) => {
                        const scoreA = a.difficulty?.[storedUserId];
                        const scoreB = b.difficulty?.[storedUserId];
                        const valA = scoreA === undefined ? 3.5 : scoreA;
                        const valB = scoreB === undefined ? 3.5 : scoreB;
                        return valB - valA;
                    });
                    setCards(sorted);
                });
        }
    }, [roomId]);

    const handleRateDifficulty = async (score) => {
        const currentCard = cards[currentIndex];
        const cardId = currentCard._id?.$oid || currentCard._id;

        try {
            await fetch(`/flashcards/${cardId}/rate_difficulty`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    user_id: userId,
                    score: score
                })
            });

            let updatedCards;
            if (score === 0) {
                updatedCards = cards.filter((_, i) => i !== currentIndex);
            } else {
                const updated = [...cards];
                updated[currentIndex].difficulty = {
                    ...(updated[currentIndex].difficulty || {}),
                    [userId]: score
                };
                updatedCards = updated.sort((a, b) => {
                    const valA = a.difficulty?.[userId] ?? 3.5;
                    const valB = b.difficulty?.[userId] ?? 3.5;
                    return valB - valA;
                });
            }

            let nextIndex = 0;
            if (score !== 0 && updatedCards.length > 1) {
                const currentId = currentCard._id?.$oid || currentCard._id;
                if (updatedCards[0]._id === currentId) {
                    nextIndex = 1;
                }
            }

            setCards(updatedCards);
            setShowAnswer(false);
            setCurrentIndex(nextIndex);
        } catch (error) {
            console.error("Fehler beim Bewerten:", error);
        }
    };

    if (cards.length === 0) {
        return (
            <div style={{ textAlign: "center", marginTop: "2rem", fontSize: "1.5rem" }}>
                Alle Karten gelernt
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
                backgroundColor: "var(--bg-color)",
                color: "var(--text-color, #fff)",
            }}
        >
            <AnimatePresence mode="wait">
                <motion.div
                    key={currentCard._id?.$oid || currentCard._id}
                    initial={{ opacity: 0, x: 100 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ duration: 0.3 }}
                    style={{
                        backgroundColor: "var(--card-bg)",
                        color: "var(--text-color)",
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
                            <p style={{ backgroundColor: "var(--bg-color)", color: "var(--text-color)", padding: "1rem", borderRadius: "8px" }}>
                                {currentCard.answer}
                            </p>
                        </>
                    )}

                    <div style={{ marginTop: "1.5rem", display: "flex", justifyContent: "space-between" }}>
                        <button onClick={() => setCurrentIndex((prevIndex) =>
                            (prevIndex - 1 + cards.length) % cards.length)}>◀ Vorherige</button>
                        <button onClick={() => setShowAnswer(!showAnswer)}>
                            {showAnswer ? "Antwort ausblenden" : "Antwort anzeigen"}
                        </button>
                        <button onClick={() => setCurrentIndex((prevIndex) =>
                            (prevIndex + 1) % cards.length)}>Nächste ▶</button>
                    </div>

                    <div style={{ marginTop: "1rem", textAlign: "center" }}>
                        <p>Wie gut konntest du die Karte beantworten?</p>
                        <div style={{ display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap" }}>
                            <button onClick={() => handleRateDifficulty(0)}>Leicht</button>
                            <button onClick={() => handleRateDifficulty(1)}>Mittel</button>
                            <button onClick={() => handleRateDifficulty(2)}>Schwer</button>
                            <button onClick={() => handleRateDifficulty(3)}>Falsch</button>
                        </div>
                    </div>

                    <p style={{ textAlign: "center", marginTop: "0.5rem" }}>
                        Schwierigkeit: {difficultyLabel[currentCard.difficulty?.[userId] ?? null] || "Unbewertet"}
                    </p>

                    <p style={{ marginTop: "1rem", textAlign: "center", fontSize: "0.9rem" }}>
                        Noch {cards.length} Karten zu lernen
                    </p>
                </motion.div>
            </AnimatePresence>
        </div>
    );
}

export default LearnView;
