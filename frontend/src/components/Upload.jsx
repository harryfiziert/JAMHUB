import React, { useRef, useState } from "react";

const Upload = ({ roomId, onUploadSuccess }) => {
    const fileInputRef = useRef(null);
    const [fileName, setFileName] = useState(null);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [successMessage, setSuccessMessage] = useState(null);
    const userId = localStorage.getItem("userId");

    const handleFile = async (file) => {
        if (file.type !== "application/pdf") {
            setError("Nur PDF-Dateien sind erlaubt.");
            setFileName(null);
            return;
        }

        setError(null);
        setFileName(file.name);
        setUploading(true);
        setSuccessMessage(null);

        const formData = new FormData();
        formData.append("file", file);
        formData.append("user_id", userId);
        formData.append("room_id", roomId);

        try {
            const res = await fetch("http://localhost:8000/flashcards/from-pdf", {
                method: "POST",
                body: formData,
            });

            if (!res.ok) throw new Error("Upload fehlgeschlagen");

            const data = await res.json();
            setSuccessMessage(`Erfolgreich verarbeitet: ${data.message}`);

            console.log("Upload erfolgreich, callback wird aufgerufen");
            if (onUploadSuccess) onUploadSuccess();

        } catch (err) {
            console.error("Upload fehlgeschlagen:", err);
            setError("Fehler beim Hochladen.");
        } finally {
            setUploading(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                padding: "40px",
            }}
        >
            <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                style={{
                    border: "2px dashed #ccc",
                    borderRadius: "12px",
                    padding: "40px",
                    textAlign: "center",
                    cursor: "pointer",
                    width: "100%",
                    maxWidth: "450px",
                    backgroundColor: "#f9f9f9",
                }}
            >
                <p style={{ marginBottom: "16px", fontSize: "16px", color: "#333" }}>
                    Ziehe eine PDF hierher oder klicke zum Hochladen
                </p>
                <input
                    type="file"
                    accept="application/pdf"
                    ref={fileInputRef}
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleFile(file);
                    }}
                    style={{ display: "none" }}
                />
                {fileName && <p style={{ color: "green" }}>✅ Datei ausgewählt: {fileName}</p>}
                {uploading && <p style={{ color: "#666" }}>⏳ Hochladen...</p>}
                {error && <p style={{ color: "red" }}>{error}</p>}
                {successMessage && <p style={{ color: "green" }}>{successMessage}</p>}
            </div>
        </div>
    );
};

export default Upload;
