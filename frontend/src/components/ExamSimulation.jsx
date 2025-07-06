import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

function ExamSimulation() {
    const { roomId } = useParams();
    const userId = localStorage.getItem("userId");
    const [cards, setCards] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [showAnswer, setShowAnswer] = useState(false);
    const [evaluations, setEvaluations] = useState([]); // [{cardId, result}]
    const [done, setDone] = useState(false);

    useEffect(() => {
        if (!userId || !roomId) return;

        fetch(`http://localhost:8000/exam-simulation/${userId}?room_id=${roomId}&limit=5`)
            .then(res => res.json())
            .then(data => setCards(data))
            .catch(err => console.error("Fehler beim Laden der Prüfungskarten:", err));
    }, [roomId]);

    const handleEvaluation = (value) => {
        const card = cards[currentIndex];
        setEvaluations((prev) => [...prev, { cardId: card._id, result: value }]);
        setShowAnswer(false);

        if (currentIndex + 1 < cards.length) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setDone(true);
        }
    };

    const getSummary = () => {
        const total = evaluations.length;
        let points = 0;

        evaluations.forEach((e) => {
            if (e.result === "correct") points += 1;
            else if (e.result === "partial") points += 0.5;
        });

        const percent = Math.round((points / total) * 100);
        return {
            total,
            correct: points,
            percent
        };
    };

    if (cards.length === 0) {
        return <div style={{ padding: "2rem" }}>Keine Karten gefunden.</div>;
    }

    if (done) {
        const summary = getSummary();
        return (
            <div style={{ padding: "2rem", textAlign: "center" }}>
                <h2>Prüfung abgeschlossen</h2>
                <p>{summary.correct} von {summary.total} richtig</p>
                <p>Ergebnis: {summary.percent}%</p>
                <p>Note: {
                    summary.percent >= 90 ? "Sehr gut" :
                        summary.percent >= 75 ? "Gut" :
                            summary.percent >= 60 ? "Befriedigend" :
                                summary.percent >= 50 ? "Genügend" : "Nicht genügend"
                }</p>
            </div>
        );
    }

    const card = cards[currentIndex];

    return (
        <div style={{ padding: "2rem" }}>
            <h2>📘 Prüfung im Raum: {roomId}</h2>
            <p><strong>Frage {currentIndex + 1} von {cards.length}:</strong></p>
            <p style={{ fontSize: "1.2rem" }}>{card.question}</p>

            {!showAnswer && (
                <button onClick={() => setShowAnswer(true)} style={btnStyle}>
                    Antwort anzeigen
                </button>
            )}

            {showAnswer && (
                <>
                    <div style={{ margin: "1rem 0", padding: "1rem", background: "#2a2a2a", borderRadius: "6px" }}>
                        <strong>Antwort:</strong>
                        <p>{card.answer}</p>
                    </div>
                    <p>Wie gut konntest du sie beantworten?</p>
                    <div style={{ display: "flex", gap: "10px" }}>
                        <button onClick={() => handleEvaluation("correct")} style={btnGreen}>Richtig</button>
                        <button onClick={() => handleEvaluation("partial")} style={btnYellow}>Teilweise</button>
                        <button onClick={() => handleEvaluation("wrong")} style={btnRed}>Falsch</button>
                    </div>
                </>
            )}
        </div>
    );
}

const btnStyle = {
    padding: "10px 20px",
    background: "#007bff",
    color: "#fff",
    border: "none",
    borderRadius: "5px",
    cursor: "pointer"
};

const btnGreen = { ...btnStyle, background: "#28a745" };
const btnRed = { ...btnStyle, background: "#dc3545" };
const btnYellow = { ...btnStyle, background: "#ffc107", color: "#000" };

export default ExamSimulation;
