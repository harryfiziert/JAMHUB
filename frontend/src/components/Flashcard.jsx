import React, { useEffect, useState } from "react";

const Flashcards = ({ roomId }) => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ question: "", answer: "" });
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        fetch(`http://localhost:8000/flashcards/by-room-and-user/${roomId}/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                if (!Array.isArray(data)) {
                    console.error("Kein Array erhalten:", data);
                    setCards([]);
                    return;
                }
                setCards(data);
                setLoading(false);
                data.forEach((card) => fetchComments(card._id));
            })
            .catch((err) => {
                console.error("Fehler beim Laden:", err);
                setLoading(false);
            });
    }, [roomId, userId]);

    const fetchComments = (cardId) => {
        fetch(`http://127.0.0.1:8000/comments/${cardId}`)
            .then((res) => res.json())
            .then((data) => {
                setComments((prev) => ({ ...prev, [cardId]: data }));
            })
            .catch((err) => console.error("Kommentare laden fehlgeschlagen:", err));
    };

    const handleEditClick = (card) => {
        setEditingId(card._id);
        setEditData({ question: card.question, answer: card.answer });
    };

    const handleChange = (e) => {
        setEditData({ ...editData, [e.target.name]: e.target.value });
    };

    const handleSave = async (id) => {
        const payload = {
            question: editData.question?.trim(),
            answer: editData.answer?.trim(),
        };

        try {
            const res = await fetch(`http://127.0.0.1:8000/flashcard/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Update fehlgeschlagen");

            setCards((prev) =>
                prev.map((card) => (card._id === id ? { ...card, ...payload } : card))
            );
            setEditingId(null);
        } catch (err) {
            console.error("❌ Speichern fehlgeschlagen:", err);
        }
    };

    const handleCommentChange = (cardId, value) => {
        setNewComment((prev) => ({ ...prev, [cardId]: value }));
    };

    const handleCommentSubmit = async (cardId) => {
        const content = newComment[cardId]?.trim();
        if (!content || !userId) return;

        try {
            const res = await fetch("http://127.0.0.1:8000/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flashcard_id: cardId,
                    user_id: userId,
                    content,
                }),
            });

            if (!res.ok) throw new Error("Kommentar konnte nicht gesendet werden");

            setNewComment((prev) => ({ ...prev, [cardId]: "" }));
            fetchComments(cardId);
        } catch (err) {
            console.error("Kommentar speichern fehlgeschlagen:", err);
        }
    };

    const handleCommentDelete = async (commentId, cardId) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/comments/${commentId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Löschen fehlgeschlagen");
            fetchComments(cardId);
        } catch (err) {
            console.error("Kommentar löschen fehlgeschlagen:", err);
        }
    };

    const handleCommentKeyPress = (e, cardId) => {
        if (e.key === "Enter") handleCommentSubmit(cardId);
    };

    if (loading) {
        return <p>Flashcards werden geladen...</p>;
    }

    return (
        <div style={styles.container}>
            <h2>Flashcards</h2>
            {cards.length === 0 ? (
                <p>Keine Flashcards vorhanden.</p>
            ) : (
                cards.map((card) => (
                    <div key={card._id} style={styles.card}>
                        {editingId === card._id ? (
                            <>
                                <input
                                    name="question"
                                    value={editData.question}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                                <input
                                    name="answer"
                                    value={editData.answer}
                                    onChange={handleChange}
                                    style={styles.input}
                                />
                                <button onClick={() => handleSave(card._id)} style={styles.saveButton}>
                                    💾 Speichern
                                </button>
                            </>
                        ) : (
                            <>
                                <p><strong>Q:</strong> {card.question}</p>
                                <p><strong>A:</strong> {card.answer}</p>
                                <button onClick={() => handleEditClick(card)} style={styles.editButton}>
                                    📝 Bearbeiten
                                </button>
                            </>
                        )}

                        <div>
                            <strong>Kommentare:</strong>
                            <ul>
                                {(comments[card._id] || []).map((c) => (
                                    <li key={c.id}>
                                        {c.content}
                                        <button onClick={() => handleCommentDelete(c.id, card._id)}>🗑</button>
                                    </li>
                                ))}
                            </ul>
                            <input
                                type="text"
                                placeholder="Kommentar..."
                                value={newComment[card._id] || ""}
                                onChange={(e) => handleCommentChange(card._id, e.target.value)}
                                onKeyDown={(e) => handleCommentKeyPress(e, card._id)}
                            />
                            <button onClick={() => handleCommentSubmit(card._id)}>➕</button>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    container: { padding: "32px", fontFamily: "Arial, sans-serif" },
    card: {
        padding: "16px",
        marginBottom: "24px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
    },
    input: {
        width: "100%",
        padding: "8px",
        marginBottom: "8px",
    },
    editButton: {
        backgroundColor: "#007bff",
        color: "white",
        padding: "6px 12px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginTop: "8px",
    },
    saveButton: {
        backgroundColor: "#28a745",
        color: "white",
        padding: "6px 12px",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
        marginTop: "8px",
    },
};

export default Flashcards;
