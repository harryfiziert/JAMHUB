// src/pages/Badges.jsx
import React, { useEffect, useState } from "react";

const badgeDetails = {
    "🔰 Beginner": "Lerne 5  Karten",
    "🥉 Learner": "Lerne 10  Karten",
    "🥈 Scholar": "Lerne 50  Karten",
    "🥇 Master": "Lerne 200  Kartenn"
};

const Badges = () => {
    const [badges, setBadges] = useState([]);
    const [total, setTotal] = useState(0);
    const userId = localStorage.getItem("userId");

    useEffect(() => {
        if (!userId) return;
        fetch(`http://localhost:8000/badges/${userId}`)
            .then((res) => res.json())
            .then((data) => {
                setBadges(data.badges);
                setTotal(data.total_learned);
            })
            .catch((err) => console.error("Fehler beim Laden der Badges:", err));
    }, [userId]);

    return (
        <div
            style={{
                padding: "2rem",
                color: "var(--text-color)",
                backgroundColor: "var(--background-color)",
                minHeight: "100vh",
            }}
        >
            <h1 style={{ marginBottom: "1rem" }}>🎓 Deine Badges</h1>
            <p style={{ fontSize: "1.2rem" }}>
                Gelernt: <strong>{total}</strong> Karten
            </p>

            <div style={{ marginTop: "2rem" }}>
                {badges.length > 0 ? (
                    badges.map((badge, i) => (
                        <div key={i} style={{ marginBottom: "1.5rem" }}>
                            <div style={{ fontSize: "2rem" }}>{badge}</div>
                            <div style={{ fontSize: "1rem", opacity: 0.8 }}>
                                {badgeDetails[badge] || "Kein Beschreibungstext vorhanden."}
                            </div>
                        </div>
                    ))
                ) : (
                    <p>Noch keine Badges freigeschaltet.</p>
                )}
            </div>
        </div>
    );
};

export default Badges;
