import React from "react";

const Dashboard = () => {
    const username = localStorage.getItem("username") || "User";

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
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "Arial, sans-serif"
        }}>
            <h1 style={{ fontSize: "32px", fontWeight: "600", marginBottom: "16px" }}>
                Welcome back, {username} 👋
            </h1>
            <p style={{ fontSize: "18px", opacity: 0.8 }}>
                Schön, dass du wieder da bist. Viel Erfolg beim Lernen!
            </p>
        </div>
    );
};

export default Dashboard;
