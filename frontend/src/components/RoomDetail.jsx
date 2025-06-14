import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { auth } from "../Firebase";

const RoomDetail = () => {
  const { roomId } = useParams();
  const [room, setRoom] = useState(null);
  const [flashcards, setFlashcards] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  // Lade Raum-Infos
  useEffect(() => {
    fetch(`http://localhost:8000/room/${roomId}`)
      .then((res) => res.json())
      .then((data) => setRoom(data))
      .catch((err) => console.error("Fehler beim Laden des Raums:", err));
  }, [roomId]);

  // Lade Flashcards
  useEffect(() => {
    fetch(`http://localhost:8000/flashcards/by-room/${roomId}`)
      .then((res) => res.json())
      .then((data) => setFlashcards(data))
      .catch((err) => console.error("Fehler beim Laden der Flashcards:", err));
  }, [roomId]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!file || !auth.currentUser) return;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("user_id", auth.currentUser.uid);
    formData.append("room_id", roomId);

    try {
      const res = await fetch("http://localhost:8000/flashcards/from-pdf", {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      setStatus("✅ Flashcards erstellt: " + data.length);
      setFlashcards((prev) => [...prev, ...data]);
    } catch (err) {
      console.error("Fehler beim Hochladen:", err);
      setStatus("❌ Fehler beim Hochladen");
    }
  };

  return (
    <div style={styles.wrapper}>
      <h2>Raum: {room?.title || roomId}</h2>
      <p>{room?.description}</p>

      <div style={styles.uploadBox}>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} style={styles.uploadButton}>PDF hochladen & Flashcards erstellen</button>
        {status && <p>{status}</p>}
      </div>

      <h3>Flashcards in diesem Raum</h3>
      {flashcards.length === 0 ? (
        <p>Keine Flashcards vorhanden.</p>
      ) : (
        <ul>
          {flashcards.map((card, idx) => (
            <li key={idx}>
              <strong>Q:</strong> {card.question} <br />
              <strong>A:</strong> {card.answer}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

const styles = {
  wrapper: {
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
  },
  uploadBox: {
    margin: "20px 0",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  uploadButton: {
    padding: "10px",
    backgroundColor: "#1e1e2f",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
  },
};

export default RoomDetail;