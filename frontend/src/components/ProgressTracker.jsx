import { useEffect, useState } from "react";
import axios from "axios";

const ProgressTracker = ({ userId }) => {
  const [sets, setSets] = useState([]);

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/progress/${userId}`);
        setSets(res.data.sets);
      } catch (err) {
        console.error("Fehler beim Laden des Fortschritts:", err);
      }
    };
    fetchProgress();
  }, [userId]);

  return (
    <div style={styles.wrapper}>
      <h2 style={styles.heading}>Lernfortschritt</h2>
      {sets.map((set) => {
        const percent = Math.round((set.learned_cards / set.total_cards) * 100);
        return (
          <div key={set.set_id || set._id} style={styles.setBox}>
            <h3>{set.title || "Unbenanntes Set"}</h3>
            <div style={styles.progressBarBackground}>
              <div style={{ ...styles.progressBarFill, width: `${percent}%` }} />
            </div>
            <p style={styles.percentText}>
              {percent}% gelernt ({set.learned_cards} / {set.total_cards})
            </p>
          </div>
        );
      })}
    </div>
  );
};

const styles = {
  wrapper: {
    marginTop: "40px",
    padding: "20px",
    borderRadius: "16px",
    backgroundColor: "#fff",
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
  },
  heading: {
    fontSize: "22px",
    marginBottom: "20px",
  },
  setBox: {
    marginBottom: "24px",
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
    color: "#333",
  },
};

export default ProgressTracker;
