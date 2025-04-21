import React, { useRef, useState } from "react";

const Upload = () => {
    const fileInputRef = useRef<HTMLInputElement | null>(null);
    const [fileName, setFileName] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        const file = e.dataTransfer.files[0];
        handleFile(file);
    };

    const handleFile = (file: File) => {
        if (file.type !== "application/pdf") {
            setError("Nur PDF-Dateien sind erlaubt.");
            setFileName(null);
        } else {
            setError(null);
            setFileName(file.name);
        }
    };

    return (
        <div
            style={{
                height: "100%",
                width: "100%",
                display: "flex",
                justifyContent: "flex-start", // Startausrichtung
                alignItems: "center",
                paddingLeft: "45%", // ✨ weiter nach rechts
                boxSizing: "border-box",
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
                    boxSizing: "border-box",
                }}
            >
                <p style={{ marginBottom: "16px", fontSize: "16px", color: "#333" }}>
                    📄 Ziehe eine PDF hierher oder klicke zum Hochladen
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
                {fileName && <p style={{ color: "green" }}>✅ Hochgeladen: {fileName}</p>}
                {error && <p style={{ color: "red" }}>⚠️ {error}</p>}
            </div>
        </div>
    );
};

export default Upload;

