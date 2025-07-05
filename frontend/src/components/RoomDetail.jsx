import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

function RoomDetail() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
  console.log("1")
    fetch(`http://localhost:8000/flashcards/by-room-and-user/${roomId}/${userId}`)
        .then((res) => res.json())
        .then((data) => setFlashcards(data))
        .catch((err) => console.error("Fehler beim Laden der Flashcards:", err));
  }, [roomId, userId]);

  const handleStartLearning = () => {
    navigate(`/learn/${roomId}`);
  };

    const handleStartExam = () => {
        navigate(`/exam/${roomId}`);
    };


    return (
        <div className="p-4 text-white">
            <h2 className="text-xl font-bold mb-4">Raum: {roomId}</h2>

            {flashcards.length > 0 && (
                <div className="mb-6 flex flex-wrap gap-4">
                    <button
                        onClick={handleStartLearning}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
                    >
                        Lernen starten
                    </button>

                    <button
                        onClick={handleStartExam}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                    >
                        Prüfung starten
                    </button>
                </div>
            )}






            {/* Flashcards anzeigen */
}
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
