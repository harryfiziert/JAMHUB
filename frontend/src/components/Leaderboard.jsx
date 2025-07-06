import React, { useEffect, useState } from "react";

function Leaderboard({ roomId }) {
    const [entries, setEntries] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/leaderboard/${roomId}`)

            .then(res => res.json())
            .then(data => {
                console.log("Leaderboard-Response:", data);
                setEntries(data);
                setLoading(false);
            })



            .catch(err => {
                console.error("Fehler beim Laden des Leaderboards:", err);
                setLoading(false);
            });

    }, [roomId]);




    if (loading) {
        return <p> Lade Leaderboard...</p>;
    }

    if (entries.length === 0) {
        return <p>Noch keine Fortschritte im Raum.</p>;
    }

    return (
        <div style={{ marginTop: "2rem" }}>
            <h3 style={{ marginBottom: "1rem" }}>Leaderboard </h3>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                <tr>
                    <th style={thStyle}>#</th>
                    <th style={thStyle}>Benutzer</th>
                    <th style={thStyle}>Gelernt</th>
                </tr>
                </thead>
                <tbody>
                {entries.map((entry, i) => (
                    <tr
                        key={entry.user_id}
                    >

                        <td style={tdStyle}>{i + 1}</td>
                        <td style={tdStyle}>{entry.username}</td>
                        <td style={tdStyle}>{entry.learned_count}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}

const thStyle = {
    textAlign: "left",
    borderBottom: "1px solid #555",
    padding: "8px"
};

const tdStyle = {
    padding: "8px",
    borderBottom: "1px solid #333"
};

export default Leaderboard;
