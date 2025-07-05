import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

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

                        // undefined = neu → behandeln wie 3 (ganz vorne)
                        const valA = scoreA === undefined ? 3.5 : scoreA;
                        const valB = scoreB === undefined ? 3.5 : scoreB;

                        return valB - valA; // höherer Wert = weiter vorne
                    });

                    setCards(sorted);
                });
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

            if (score === 0) {
                nextIndex = 0; // Karte wurde entfernt
            } else if (updatedCards.length > 1) {
                // gleiche Karte ist noch auf Platz 0 → dann Index 1
                const currentId = currentCard._id?.$oid || currentCard._id;
                if (updatedCards[0]._id === currentId && updatedCards.length > 1) {
                    nextIndex = 1;
                }
            }

            setCards(updatedCards);
            setShowAnswer(false);
            setCurrentIndex(nextIndex);
            console.log("Springe zu Karte:", updatedCards[nextIndex]?.question);


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
                <h3 style={{marginBottom: "0.5rem"}}>Frage</h3>
                <p style={{fontSize: "1.2rem", fontWeight: "bold"}}>{currentCard.question}</p>

                {showAnswer && (
                    <>
                        <h4>Antwort</h4>
                        <p style={{background: "#3a3a3a", padding: "1rem", borderRadius: "8px"}}>
                            {currentCard.answer}
                        </p>
                    </>
                )}

                <div style={{marginTop: "1.5rem", display: "flex", justifyContent: "space-between"}}>
                    <button onClick={handlePrevious}>◀ Vorherige</button>
                    <button onClick={() => setShowAnswer(!showAnswer)}>
                        {showAnswer ? "Antwort ausblenden" : "Antwort anzeigen"}
                    </button>
                    <button onClick={handleNext}>Nächste ▶</button>
                </div>

                <div style={{marginTop: "1rem", textAlign: "center"}}>
                    <p>Wie gut konntest du die Karte beantworten?</p>
                    <div style={{display: "flex", gap: "8px", justifyContent: "center", flexWrap: "wrap"}}>
                        <button onClick={() => handleRateDifficulty(0)}>Leicht</button>
                        <button onClick={() => handleRateDifficulty(1)}>Mittel</button>
                        <button onClick={() => handleRateDifficulty(2)}>Schwer</button>
                        <button onClick={() => handleRateDifficulty(3)}>Falsch</button>
                    </div>
                </div>

                <p style={{textAlign: "center", marginTop: "0.5rem"}}>
                    Schwierigkeit: {difficultyLabel[currentCard.difficulty?.[userId] ?? null] || "Unbewertet"}
                </p>

                <p style={{marginTop: "1rem", textAlign: "center", fontSize: "0.9rem"}}>
                    Noch {cards.length} Karten zu lernen
                </p>

            </div>
        </div>
    );
}

export default LearnView;
