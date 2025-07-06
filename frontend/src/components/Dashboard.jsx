import React, { useEffect, useState } from "react";
import axios from "axios";
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from "recharts";

const Dashboard = () => {
    const username = localStorage.getItem("username") || "User";
    const userId = localStorage.getItem("userId");
    const [stats, setStats] = useState([]);

    useEffect(() => {
        if (!userId) return;
        axios.get(`http://localhost:8000/learning-stats/${userId}`)
            .then(res => {
                const sorted = [...res.data]
                    .sort((a, b) => new Date(a.date) - new Date(b.date));
                setStats(sorted);
            })
            .catch(err => console.error("Fehler beim Laden der Stats:", err));
    }, [userId]);

    return (
        <div style={styles.container}>
            <h1 style={styles.heading}>Welcome back, {username}</h1>
            <p style={styles.subheading}>Schön, dass du wieder da bist. Viel Erfolg beim Lernen!</p>

            {stats.length > 0 ? (
                <div style={{ marginTop: "40px", width: "100%", maxWidth: "900px" }}>
                    <h2 style={styles.chartTitle}>Dein Lernverlauf (gelernte Karten pro Tag)</h2>
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={stats}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#555" />
                            <XAxis dataKey="date" tick={{ fill: "#ccc" }} />
                            <YAxis allowDecimals={false} tick={{ fill: "#ccc" }} />
                            <Tooltip
                                contentStyle={{ backgroundColor: "#222", border: "none", color: "#fff" }}
                                labelStyle={{ color: "#fff" }}
                            />
                            <Bar dataKey="count" fill="#82ca9d" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            ) : (
                <p style={styles.noData}>Du hast noch keine Karten gelernt.</p>
            )}
        </div>
    );
};

const styles = {
    container: {
        padding: "32px",
        backgroundColor: "var(--bg-color)",
        color: "var(--text-color)",
        minHeight: "100vh",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    heading: {
        fontSize: "32px",
        fontWeight: "600",
        marginBottom: "8px",
        textAlign: "center",
    },
    subheading: {
        fontSize: "18px",
        opacity: 0.8,
        textAlign: "center",
    },
    chartTitle: {
        textAlign: "center",
        marginBottom: "20px",
        fontSize: "20px",
    },
    noData: {
        marginTop: "40px",
        textAlign: "center",
        opacity: 0.6,
    },
};

export default Dashboard;
