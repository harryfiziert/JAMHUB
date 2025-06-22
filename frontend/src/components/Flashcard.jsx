import React, { useEffect, useState } from "react";

const Flashcards = () => {
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingId, setEditingId] = useState(null);
    const [editData, setEditData] = useState({ question: "", answer: "" });
    const [comments, setComments] = useState({});
    const [newComment, setNewComment] = useState({});

    useEffect(() => {
        fetch("http://127.0.0.1:8000/flashcards/by-user/test-user")
            .then((res) => res.json())
            .then((data) => {
                setCards(data);
                setLoading(false);
                data.forEach((card) => fetchComments(card._id));
            })
            .catch((err) => {
                console.error("❌ Error loading flashcards:", err);
                setLoading(false);
            });
    }, []);

    const fetchComments = (cardId) => {
        fetch(`http://127.0.0.1:8000/comments/${cardId}`)
            .then((res) => res.json())
            .then((data) => {
                setComments((prev) => ({ ...prev, [cardId]: data }));
            })
            .catch((err) => console.error("❌ Fetch comments failed:", err));
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
            learned: cards.find((c) => c._id === id)?.learned ?? false,
        };

        try {
            const res = await fetch(`http://127.0.0.1:8000/flashcard/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Update failed");

            setCards((prev) =>
                prev.map((card) => (card._id === id ? { ...card, ...payload } : card))
            );
            setEditingId(null);
        } catch (err) {
            console.error("❌ Save failed:", err);
        }
    };

    const handleCommentChange = (cardId, value) => {
        setNewComment((prev) => ({ ...prev, [cardId]: value }));
    };

    const handleCommentSubmit = async (cardId) => {
        const content = newComment[cardId]?.trim();
        if (!content) return;

        try {
            const res = await fetch("http://127.0.0.1:8000/comments", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    flashcard_id: cardId,
                    user_id: "test-user",
                    content,
                }),
            });

            if (!res.ok) throw new Error("Comment post failed");

            setNewComment((prev) => ({ ...prev, [cardId]: "" }));
            fetchComments(cardId);
        } catch (err) {
            console.error("❌ Submit comment failed:", err);
        }
    };

    const handleCommentDelete = async (commentId, cardId) => {
        try {
            const res = await fetch(`http://127.0.0.1:8000/comments/${commentId}`, {
                method: "DELETE",
            });
            if (!res.ok) throw new Error("Delete failed");
            fetchComments(cardId); // Refresh comment list
        } catch (err) {
            console.error("❌ Delete comment failed:", err);
        }
    };

    const handleCommentKeyPress = (e, cardId) => {
        if (e.key === "Enter") handleCommentSubmit(cardId);
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <p style={styles.loadingText}>Loading flashcards...</p>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>Flashcards</h2>
            {cards.length === 0 ? (
                <p style={styles.noData}>No flashcards available.</p>
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
                                    placeholder="Question"
                                />
                                <input
                                    name="answer"
                                    value={editData.answer}
                                    onChange={handleChange}
                                    style={styles.input}
                                    placeholder="Answer"
                                />
                                <button
                                    onClick={() => handleSave(card._id)}
                                    style={styles.saveButton}
                                >
                                    💾 Speichern
                                </button>
                            </>
                        ) : (
                            <>
                                <p><strong>Q:</strong> {card.question}</p>
                                <p><strong>A:</strong> {card.answer}</p>
                                <button
                                    onClick={() => handleEditClick(card)}
                                    style={styles.editButton}
                                >
                                    📝 Bearbeiten
                                </button>
                            </>
                        )}

                        {/* 💬 Comments */}
                        <div style={styles.commentSection}>
                            <strong>Kommentare:</strong>
                            <ul style={styles.commentList}>
                                {(comments[card._id] || []).map((c) => (
                                    <li key={c._id} style={styles.commentItem}>
                                        {c.content}
                                        <button
                                            onClick={() => handleCommentDelete(c._id, card._id)}
                                            style={styles.deleteButton}
                                        >
                                            🗑
                                        </button>
                                    </li>
                                ))}
                            </ul>
                            <div style={styles.commentInputWrapper}>
                                <input
                                    type="text"
                                    placeholder="Kommentar hinzufügen..."
                                    value={newComment[card._id] || ""}
                                    onChange={(e) =>
                                        handleCommentChange(card._id, e.target.value)
                                    }
                                    onKeyDown={(e) => handleCommentKeyPress(e, card._id)}
                                    style={styles.commentInput}
                                />
                                <button
                                    onClick={() => handleCommentSubmit(card._id)}
                                    style={styles.commentButton}
                                >
                                    ➕
                                </button>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

const styles = {
    container: { padding: "32px", fontFamily: "Arial, sans-serif", color: "#333" },
    heading: { fontSize: "24px", marginBottom: "20px" },
    loadingContainer: { padding: "32px" },
    loadingText: { fontSize: "18px", color: "#666" },
    noData: { fontSize: "16px", color: "#888" },
    card: {
        padding: "16px",
        marginBottom: "24px",
        backgroundColor: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
        border: "1px solid #ddd",
    },
    input: {
        width: "100%",
        padding: "8px",
        marginBottom: "8px",
        border: "1px solid #ccc",
        borderRadius: "4px",
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
    commentSection: {
        marginTop: "20px",
    },
    commentList: {
        paddingLeft: "20px",
        marginTop: "10px",
    },
    commentItem: {
        fontSize: "14px",
        color: "#444",
        marginBottom: "6px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
    },
    deleteButton: {
        marginLeft: "10px",
        background: "none",
        border: "none",
        color: "#c00",
        cursor: "pointer",
        fontSize: "14px",
    },
    commentInputWrapper: {
        display: "flex",
        marginTop: "10px",
        gap: "8px",
    },
    commentInput: {
        flex: 1,
        padding: "6px",
        border: "1px solid #ccc",
        borderRadius: "4px",
    },
    commentButton: {
        padding: "6px 10px",
        backgroundColor: "#444",
        color: "white",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
    },
};

export default Flashcards;
