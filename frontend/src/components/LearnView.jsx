import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./LearnView.css"; // optional für extra Styles

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
        await fetch(`/flashcards/${currentCard._id}/mark-learned`, {
            method: "PATCH",
        });

        const updatedCards = cards.filter((_, i) => i !== currentIndex);
        setCards(updatedCards);
        setShowAnswer(false);
        setCurrentIndex(0);
    };

    if (cards.length === 0) {
        return <div className="learn-finished">Alle Karten gelernt 🎉</div>;
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="learn-container">
            <div className="flashcard">
                <h3>Frage</h3>
                <p>{currentCard.question}</p>

                {showAnswer && (
                    <>
                        <h4>Antwort</h4>
                        <p>{currentCard.answer}</p>
                    </>
                )}

                <div className="button-row">
                    <button onClick={handlePrevious}>◀ Vorherige</button>
                    <button onClick={() => setShowAnswer(!showAnswer)}>
                        {showAnswer ? "Antwort ausblenden" : "Antwort anzeigen"}
                    </button>
                    <button onClick={handleNext}>Nächste ▶</button>
                </div>

                <button className="learned-button" onClick={handleMarkAsLearned}>
                    ✅ Als gelernt markieren
                </button>

                <p className="progress-indicator">
                    Karte {currentIndex + 1} / {cards.length}
                </p>
            </div>
        </div>
    );
}

export default LearnView;
