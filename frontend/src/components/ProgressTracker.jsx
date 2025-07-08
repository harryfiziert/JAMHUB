import { useEffect, useState } from "react";
import axios from "axios";

const ProgressTracker = ({ userId, roomId }) => {
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/progress/${userId}/${roomId}`);
        setProgress(res.data);
      } catch (err) {
        console.error(" Fehler beim Laden des Fortschritts:", err);
      }
    };

    if (userId && roomId) fetchProgress();
  }, [userId, roomId]);

  if (!progress) return null;

  return (
      <div style={styles.wrapper}>
        <h3 style={styles.heading}>Lernfortschritt in diesem Raum</h3>

        {progress.total_cards > 0 ? (
            <>
              <div style={styles.progressBarBackground}>
                <div style={{ ...styles.progressBarFill, width: `${progress.percent}%` }} />
              </div>
              <p style={styles.percentText}>
                {progress.percent}% gelernt ({progress.learned_cards} von {progress.total_cards})
              </p>
            </>
        ) : (
            <p style={styles.percentText}>Noch keine Karten im Raum</p>
        )}
      </div>
  );

};

const styles = {
  wrapper: {
    marginTop: "20px",
    padding: "16px",
    borderRadius: "12px",
    backgroundColor: "var(--card-bg)",
    color: "var(--text-color)",
    border: "1px solid var(--border-color)",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "18px",
    marginBottom: "12px",
  },
  progressBarBackground: {
    backgroundColor: "#eee",
    width: "100%",
    height: "14px",
    borderRadius: "7px",
    overflow: "hidden",
  },
  progressBarFill: {
    backgroundColor: "#4caf50",
    height: "100%",
  },
  percentText: {
    fontSize: "13px",
    marginTop: "8px",
    color: "var(--text-color)",
  },
};

export default ProgressTracker;
