import React, { useEffect, useState } from "react";

const ExamSimulation = () => {
    const [cards, setCards] = useState([]);
    const [userAnswers, setUserAnswers] = useState({});
    const [results, setResults] = useState({});

    useEffect(() => {
        fetch("http://127.0.0.1:8000/flashcards/by-user/test-user")
            .then((res) => res.json())
            .then((data) => {
                const shuffled = data.sort(() => 0.5 - Math.random()).slice(0, 5);
                setCards(shuffled);
            })
            .catch((err) => console.error("Fehler beim Laden der Karten:", err));
    }, []);

    const handleChange = (cardId, value) => {
        setUserAnswers((prev) => ({ ...prev, [cardId]: value }));
    };

    const handleSubmit = () => {
        const feedback = {};
        cards.forEach((card) => {
            const correct = card.answer?.trim().toLowerCase();
            const given = userAnswers[card._id]?.trim().toLowerCase();
            feedback[card._id] = correct === given;
        });
        setResults(feedback);
    };

    return (
        <div className="exam-container" style={{ padding: "32px" }}>
            <h2 style={{ marginBottom: "24px" }}>📘 Exam Simulation</h2>

            {cards.length === 0 && (
                <p style={{ color: "var(--text-color)" }}>Keine Karten gefunden.</p>
            )}

            {cards.map((card, index) => (
                <div key={card._id} className="exam-question">
                    <strong style={{ display: "block", marginBottom: "8px" }}>
                        Q{index + 1}: {card.question}
                    </strong>
                    <input
                        type="text"
                        value={userAnswers[card._id] || ""}
                        onChange={(e) => handleChange(card._id, e.target.value)}
                        style={{
                            width: "100%",
                            padding: "10px",
                            borderRadius: "4px",
                            border: "1px solid var(--border-color)",
                            color: "var(--text-color)",
                            backgroundColor: "var(--bg-color)"
                        }}
                    />
                    {results[card._id] !== undefined && (
                        <p
                            style={{
                                marginTop: "8px",
                                color: results[card._id] ? "limegreen" : "tomato",
                                fontWeight: "bold"
                            }}
                        >
                            {results[card._id]
                                ? "✅ Richtig"
                                : `❌ Falsch – korrekt: ${card.answer}`}
                        </p>
                    )}
                </div>
            ))}

            {cards.length > 0 && (
                <div style={{ textAlign: "center", marginTop: "32px" }}>
                    <button onClick={handleSubmit}>Submit</button>
                </div>
            )}
        </div>
    );
};

export default ExamSimulation;
