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

    // Assuming a static user_id for now. In a real app, this would come from auth context.
    const userId = "your_user_id_here"; // ⚠️ IMPORTANT: Replace with actual user ID

    useEffect(() => {
        const fetchBadges = async () => {
            try {
                const response = await fetch(`http://localhost:8000/badges/${userId}`); // ✅ Adjust URL if needed
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
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
        <div style={styles.container}>
            {/* Header */}
            <div style={styles.header}>
                <div style={styles.greetingAndBadges}> {/* New container for greeting and badges */}
                    <h1 style={styles.greeting}>Welcome back, Georg</h1>
                    {/* Badges display in header */}
                    {loadingBadges && <p style={styles.headerBadgeText}>Loading badges...</p>}
                    {errorBadges && <p style={{ ...styles.headerBadgeText, color: 'red' }}>Error: {errorBadges.message}</p>}
                    {badgesData && badgesData.badges.length > 0 && (
                        <div style={styles.headerBadgesContainer}>
                            {badgesData.badges.map((badge, index) => (
                                <span key={index} style={styles.headerBadgeItem}>
                                    {badge}
                                </span>
                            ))}
                        </div>
                    )}
                </div>

                <div style={styles.headerRight}>
                    <div style={styles.searchWrapper}>
                        <FiSearch style={styles.searchIcon} />
                        <input
                            type="text"
                            placeholder="Search"
                            style={styles.searchInput}
                        />
                    </div>

                    <div style={styles.profile}>
                        <img src={profilePic} alt="profile" style={styles.avatar} />
                        <div style={styles.profileText}>
                            <span>Georg Mansky -</span>
                            <br />
                            <span>Kummert</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Card Grid */}
            <div style={styles.grid}>
                <div style={{ ...styles.card, backgroundColor: "#1e1e2f", color: "white" }}>
                    <h3 style={{ marginBottom: "10px" }}>FlashCards Set</h3>
                    <button style={styles.button} onClick={() => navigate("/flashcards")}>
                        Bearbeiten
                    </button>
                </div>

                <div style={styles.card}>
                    <h4 style={styles.cardTitle}>Tägliche Lernzeit</h4>
                    <p style={styles.bigText}>12.302</p>
                    <small style={styles.cardSubText}>+12.7% | +1.2k this week</small>
                </div>

                <div style={styles.card}>
                    <h4 style={styles.cardTitle}>Anzahl beantworteter Karten</h4>
                    <p style={styles.bigText}>963</p>
                </div>
            </div>

            {/* Chart */}
            <div style={styles.chartBox}>
                <div style={styles.chartHeader}>
                    <h3>Lernfortschritt</h3>
                    <select style={styles.dropdown}>
                        <option>Last 14 Days</option>
                        <option>Last 7 Days</option>
                    </select>
                </div>
                <div style={styles.chart}>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart
                            data={chartData}
                            margin={{ top: 10, right: 20, left: 0, bottom: 0 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="day" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="earnings" fill="#333" />
                            <Bar dataKey="costs" fill="#aaa" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: "32px",
        fontFamily: "Arial, sans-serif",
        backgroundColor: "#f6f6f6",
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
    },
    header: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "36px",
    },
    greetingAndBadges: { // New style for the container holding greeting and badges
        display: "flex",
        alignItems: "center",
        gap: "20px", // Space between greeting and badges
    },
    greeting: {
        fontSize: "28px",
        fontWeight: "600",
        margin: 0,
        color: "#1e1e2f",
    },
    headerRight: {
        display: "flex",
        alignItems: "center",
        gap: "24px",
    },
    searchWrapper: {
        display: "flex",
        alignItems: "center",
        backgroundColor: "#efefef",
        borderRadius: "30px",
        padding: "10px 16px",
        height: "40px",
    },
    searchIcon: {
        marginRight: "8px",
        color: "#999",
        fontSize: "16px",
    },
    searchInput: {
        border: "none",
        background: "transparent",
        outline: "none",
        fontSize: "14px",
        width: "160px",
        color: "#333",
    },
    profile: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
    },
    avatar: {
        width: "42px",
        height: "42px",
        borderRadius: "50%",
        objectFit: "cover",
    },
    profileText: {
        fontSize: "14px",
        lineHeight: "1.2",
        color: "#333",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
        gap: "24px",
        marginBottom: "40px",
    },
    card: {
        padding: "20px",
        borderRadius: "16px",
        backgroundColor: "#f4f4f4",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    button: {
        padding: "10px 16px",
        backgroundColor: "#fff",
        border: "1px solid #ccc",
        borderRadius: "8px",
        cursor: "pointer",
        color: "#333",
        fontWeight: "500",
    },
    bigText: {
        fontSize: "32px",
        fontWeight: "bold",
        margin: "10px 0",
        color: "#1e1e2f",
    },
    cardTitle: {
        fontSize: "16px",
        fontWeight: "600",
        marginBottom: "6px",
        color: "#1e1e2f",
    },
    cardSubText: {
        color: "#666",
    },
    chartBox: {
        backgroundColor: "#fff",
        padding: "20px",
        borderRadius: "16px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
    },
    chartHeader: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "10px",
    },
    dropdown: {
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
    },
    chart: {
        width: "100%",
        height: "250px",
    },
    // New styles for badges in header
    headerBadgesContainer: {
        display: "flex",
        gap: "8px", // Space between individual badges
        alignItems: "center",
    },
    headerBadgeItem: {
        backgroundColor: "#e0e0e0", // Light gray background for badges
        padding: "5px 10px",
        borderRadius: "15px",
        fontSize: "12px",
        fontWeight: "bold",
        color: "#333",
        whiteSpace: "nowrap", // Prevent badges from wrapping
    },
    headerBadgeText: { // For loading/error text in header
        fontSize: "14px",
        color: "#666",
        margin: 0,
    }
};

export default Dashboard;