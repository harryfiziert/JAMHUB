import React, { useState } from "react";

const FlashcardUploader = () => {
    const [file, setFile] = useState(null);
    const [flashcards, setFlashcards] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Bitte wählen Sie eine PDF-Datei aus.");
            return;
        }

        const formData = new FormData();
        formData.append("file", file, file.name);

        setLoading(true);
        setError("");
        try {
            const res = await fetch(
                "http://localhost:8000/flashcards/from-pdf?user_id=uid123&room_id=mathe123",
                {
                    method: "POST",
                    body: formData,
                }
            );

            if (!res.ok) {
                throw new Error("Fehler beim Upload oder Antwort vom Server.");
            }

            const data = await res.json();
            setFlashcards(data);
        } catch (err) {
            setError(err.message || "Unbekannter Fehler");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>Flashcards aus PDF generieren</h2>

            <input type="file" accept="application/pdf" onChange={handleFileChange} />
            <button onClick={handleUpload} style={styles.button} disabled={loading}>
                {loading ? "Wird hochgeladen..." : "Hochladen & Generieren"}
            </button>

            {error && <p style={styles.error}>{error}</p>}

            <div style={styles.flashcardList}>
                {flashcards.length > 0 && <h3>Generierte Flashcards:</h3>}
                {flashcards.map((card, idx) => (
                    <div key={idx} style={styles.card}>
                        <p>
                            <strong>Frage:</strong> {card.question}
                        </p>
                        <p>
                            <strong>Antwort:</strong> {card.answer}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "24px",
        maxWidth: "700px",
        margin: "0 auto",
        fontFamily: "Arial, sans-serif",
    },
    title: {
        marginBottom: "16px",
    },
    button: {
        marginTop: "12px",
        padding: "10px 16px",
        borderRadius: "8px",
        backgroundColor: "#1e1e2f",
        color: "white",
        border: "none",
        cursor: "pointer",
    },
    error: {
        color: "red",
        marginTop: "12px",
    },
    flashcardList: {
        marginTop: "24px",
    },
    card: {
        backgroundColor: "#f6f6f6",
        padding: "12px 16px",
        borderRadius: "8px",
        marginBottom: "12px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
};

export default FlashcardUploader;
