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
                data.forEach((card) => fetchComments(resolveId(card)));
            })
            .catch((err) => {
                console.error("Fehler beim Laden:", err);
                setLoading(false);
            });
    }, [roomId, userId]);

    const resolveId = (card) => card.original_id || card._id;

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

    const handleCommentSubmit = async (card) => {
        const targetId = resolveId(card);
        const content = newComment[targetId]?.trim();
        if (!content || !userId) return;

        try {
            const res = await fetch("http://127.0.0.1:8000/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flashcard_id: targetId,
                    user_id: userId,
                    content,
                }),
            });

            if (!res.ok) throw new Error("Kommentar konnte nicht gesendet werden");

            setNewComment((prev) => ({ ...prev, [targetId]: "" }));
            fetchComments(targetId);
        } catch (err) {
            console.error("Kommentar speichern fehlgeschlagen:", err);
        }
    };

    const handleCommentDelete = async (commentId, card) => {
        const targetId = resolveId(card);
        try {
            const res = await fetch(`http://127.0.0.1:8000/comments/${commentId}?user_id=${userId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Löschen fehlgeschlagen");
            fetchComments(targetId);
        } catch (err) {
            console.error("Kommentar löschen fehlgeschlagen:", err);
        }
    };

    const handleCommentKeyPress = (e, card) => {
        if (e.key === "Enter") handleCommentSubmit(card);
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
                cards.map((card) => {
                    const commentId = resolveId(card);
                    return (
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
                                        Speichern
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p><strong>Q:</strong> {card.question}</p>
                                    <p><strong>A:</strong> {card.answer}</p>
                                    <button onClick={() => handleEditClick(card)} style={styles.editButton}>
                                        Bearbeiten
                                    </button>
                                </>
                            )}

                            {/* Kommentarbereich */}
                            <div style={{
                                maxHeight: "200px",
                                overflowY: "auto",
                                marginTop: "12px",
                                border: "1px solid var(--border-color)",
                                borderRadius: "6px",
                                padding: "8px"
                            }}>
                                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                                    {(comments[commentId] || []).map((c) => {
                                        const canDelete = c.user_id === userId || card.user_id === userId;
                                        return (
                                            <li key={c._id} style={{
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "space-between",
                                                padding: "4px 0"
                                            }}>
                                                <span>
                                                    <strong>{c.username || c.user_id}</strong>: {c.content}
                                                </span>
                                                {canDelete && (
                                                    <button
                                                        onClick={() => {
                                                            if (window.confirm("Willst du den Kommentar wirklich löschen?")) {
                                                                handleCommentDelete(c._id, card);
                                                            }
                                                        }}
                                                        style={{
                                                            background: "none",
                                                            border: "none",
                                                            color: "gray",
                                                            cursor: "pointer",
                                                            fontSize: "14px",
                                                            marginLeft: "8px"
                                                        }}
                                                        title="Kommentar löschen"
                                                    >
                                                        🗑
                                                    </button>
                                                )}
                                            </li>
                                        );
                                    })}
                                </ul>
                            </div>

                            {/* Neue Kommentar-Eingabe */}
                            <div style={{ marginTop: "8px", display: "flex", gap: "8px" }}>
                                <input
                                    type="text"
                                    placeholder="Kommentar..."
                                    value={newComment[commentId] || ""}
                                    onChange={(e) => handleCommentChange(commentId, e.target.value)}
                                    onKeyDown={(e) => handleCommentKeyPress(e, card)}
                                    style={{
                                        flex: 1,
                                        padding: "6px 8px",
                                        border: "1px solid var(--border-color)",
                                        borderRadius: "6px",
                                        backgroundColor: "var(--bg-color)",
                                        color: "var(--text-color)"
                                    }}
                                />
                                <button
                                    onClick={() => handleCommentSubmit(card)}
                                    style={{
                                        padding: "6px 12px",
                                        backgroundColor: "#007bff",
                                        color: "white",
                                        border: "none",
                                        borderRadius: "6px",
                                        cursor: "pointer"
                                    }}
                                >
                                    ➕
                                </button>
                            </div>
                        </div>
                    );
                })
            )}
        </div>
    );
};

const styles = {
    container: { padding: "32px", fontFamily: "Arial, sans-serif" },
    card: {
        padding: "16px",
        marginBottom: "24px",
        backgroundColor: "var(--card-bg)",
        borderRadius: "8px",
        border: "1px solid var(--border-color)",
        color: "var(--text-color)",
    },
    input: {
        width: "100%",
        padding: "8px",
        marginBottom: "8px",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
        borderRadius: "6px"
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
