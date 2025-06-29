import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RoomDetail() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);

  useEffect(() => {
    fetch(`http://localhost:8000/flashcards/by-room/${roomId}`)
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
        .catch((error) => console.error("Fehler beim Laden der Flashcards:", error));
  }, [roomId]);

  const handleStartLearning = () => {
    navigate(`/learn/${roomId}`);
  };

  return (
      <div className="p-4 text-white">
        <h2 className="text-xl font-bold mb-4">🧠 Raum: {roomId}</h2>

        {/* Lernen starten Button */}
        {flashcards.length > 0 && (
            <button
                onClick={handleStartLearning}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded mb-6"
            >
              Lernen starten
            </button>
        )}

        {/* Flashcards anzeigen */}
        <div className="space-y-4">
          {flashcards.map((card) => (
              <div key={card._id} className="bg-gray-800 p-4 rounded shadow">
                <p className="font-semibold">Q: {card.question}</p>
                <p className="mb-2">A: {card.answer}</p>
              </div>
          ))}
        </div>
      </div>
  );
}

export default RoomDetail;
