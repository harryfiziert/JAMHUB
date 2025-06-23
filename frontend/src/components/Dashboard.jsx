import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import profilePic from "../assets/react.svg";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    CartesianGrid,
    Legend,
} from "recharts";

const chartData = [
    { day: "03 Wed", earnings: 35, costs: 50 },
    { day: "04 Thu", earnings: 40, costs: 30 },
    { day: "05 Fri", earnings: 45, costs: 40 },
    { day: "06 Sat", earnings: 38, costs: 35 },
    { day: "07 Sun", earnings: 60, costs: 45 },
    { day: "08 Mon", earnings: 55, costs: 40 },
    { day: "09 Tue", earnings: 58, costs: 33 },
    { day: "10 Wed", earnings: 20, costs: 25 },
    { day: "11 Thu", earnings: 35, costs: 30 },
    { day: "12 Fri", earnings: 40, costs: 28 },
    { day: "13 Sat", earnings: 25, costs: 20 },
    { day: "14 Sun", earnings: 15, costs: 18 },
    { day: "15 Mon", earnings: 30, costs: 22 },
    { day: "16 Tue", earnings: 50, costs: 35 },
];

const Dashboard = () => {
    const navigate = useNavigate();
    const [badgesData, setBadgesData] = useState(null);
    const [loadingBadges, setLoadingBadges] = useState(true);
    const [errorBadges, setErrorBadges] = useState(null);

    const userId = "testuser2";

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await fetch(`http://localhost:8000/badges/${userId}`);
                if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
                const data = await response.json();
                setBadgesData(data);
            } catch (error) {
                console.error("Error fetching badges:", error);
                setErrorBadges(error);
            } finally {
                setLoadingBadges(false);
            }
        };

        fetchBadges();
    }, [userId]);

    return (
        <div style={{
            padding: "32px",
            backgroundColor: "var(--bg-color)",
            color: "var(--text-color)",
            minHeight: "100vh",
            width: "100%",
            boxSizing: "border-box",
            display: "flex",
            flexDirection: "column",
            flexGrow: 1,
            fontFamily: "Arial, sans-serif"
        }}>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "36px"
            }}>
                <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
                    <h1 style={{ fontSize: "28px", fontWeight: "600", margin: 0 }}>
                        Welcome back, Georg
                    </h1>
                    {loadingBadges && <p style={{ fontSize: "14px" }}>Loading badges...</p>}
                    {errorBadges && <p style={{ fontSize: "14px", color: "red" }}>Error: {errorBadges.message}</p>}
                    {badgesData?.badges?.length > 0 && (
                        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                            {badgesData.badges.map((badge, index) => (
                                <span key={index} style={{
                                    backgroundColor: "var(--button-bg)",
                                    padding: "5px 10px",
                                    borderRadius: "15px",
                                    fontSize: "12px",
                                    fontWeight: "bold",
                                    color: "var(--text-color)",
                                    whiteSpace: "nowrap"
                                }}>{badge}</span>
                            ))}
                        </div>
                    )}
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
                    <div style={{
                        display: "flex",
                        alignItems: "center",
                        backgroundColor: "var(--card-bg)",
                        borderRadius: "30px",
                        padding: "10px 16px",
                        height: "40px"
                    }}>
                        <FiSearch style={{ marginRight: "8px", color: "var(--text-color)", fontSize: "16px" }} />
                        <input
                            type="text"
                            placeholder="Search"
                            style={{
                                border: "none",
                                background: "transparent",
                                outline: "none",
                                fontSize: "14px",
                                width: "160px",
                                color: "var(--text-color)"
                            }}
                        />
                    </div>

                    <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <img src={profilePic} alt="profile" style={{ width: "42px", height: "42px", borderRadius: "50%" }} />
                        <div style={{ fontSize: "14px", lineHeight: "1.2" }}>
                            <span>Georg Mansky -</span><br />
                            <span>Kummert</span>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "24px",
                marginBottom: "40px"
            }}>
                <div className="card">
                    <h3 style={{ marginBottom: "10px" }}>FlashCards Set</h3>
                    <button onClick={() => navigate("/flashcards")}>Bearbeiten</button>
                </div>

                <div className="card">
                    <h4>Tägliche Lernzeit</h4>
                    <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0" }}>12.302</p>
                    <small>+12.7% | +1.2k this week</small>
                </div>

                <div className="card">
                    <h4>Anzahl beantworteter Karten</h4>
                    <p style={{ fontSize: "32px", fontWeight: "bold", margin: "10px 0" }}>963</p>
                </div>
            </div>

            <div className="dashboard-box" style={{ padding: "24px" }}>
                <div style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "10px"
                }}>
                    <h3>Lernfortschritt</h3>
                    <select style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid var(--border-color)",
                        backgroundColor: "var(--card-bg)",
                        color: "var(--text-color)"
                    }}>
                        <option>Last 14 Days</option>
                        <option>Last 7 Days</option>
                    </select>
                </div>
                <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
                        <XAxis dataKey="day" stroke="var(--text-color)" />
                        <YAxis stroke="var(--text-color)" />
                        <Tooltip contentStyle={{
                            backgroundColor: "var(--card-bg)",
                            borderColor: "var(--border-color)",
                            color: "var(--text-color)"
                        }} />
                        <Legend />
                        <Bar dataKey="earnings" fill="var(--chart-bar-earnings)" />
                        <Bar dataKey="costs" fill="var(--chart-bar-costs)" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};

export default Dashboard;