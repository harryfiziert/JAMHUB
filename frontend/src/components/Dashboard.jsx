import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
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

// Example chart data
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
  const [answeredCards, setAnsweredCards] = useState(0);
  const [dailyLearningTime, setDailyLearningTime] = useState(0);
  const [user, setUser] = useState(null); // Firebase user
  const [userData, setUserData] = useState(null); // Backend user

  // Detect logged-in Firebase user
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        setUser(firebaseUser);
      } else {
        setUser(null);
        setUserData(null);
      }
    });
    return () => unsubscribe();
  }, []);

  // Fetch user data from backend
  useEffect(() => {
    if (user) {
      fetch(`http://localhost:8000/user/${user.uid}`)
        .then((res) => res.json())
        .then((data) => setUserData(data))
        .catch((err) => console.error("Failed to load userData:", err));
    }
  }, [user]);

  // Fetch flashcard count
  useEffect(() => {
    fetch("/api/flashcards/answered")
      .then((res) => res.json())
      .then((data) => setAnsweredCards(data.count))
      .catch((err) => console.error("Flashcards Error:", err));
  }, []);

  // Fetch daily learning time
  useEffect(() => {
    fetch("/api/learning-time/today")
      .then((res) => res.json())
      .then((data) => setDailyLearningTime(data.minutes))
      .catch((err) => console.error("Lernzeit Error:", err));
  }, []);

  return (
    <div style={styles.container}>
      {/* Header */}
      <div style={styles.header}>
        <h1 style={styles.greeting}>
          Welcome back, {userData?.username || "Gast"}
        </h1>
        <div style={styles.headerRight}>
          {user ? (
            <div style={styles.profile}>
              <img src={profilePic} alt="profile" style={styles.avatar} />
              <div style={styles.profileText}>
                <span>{userData?.username || "User"}</span>
                <br />
                <span>{userData?.university || "..."}</span>
              </div>
            </div>
          ) : (
            <button
              onClick={() => (window.location.href = "/login")}
              style={styles.loginButton}
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* Cards */}
      <div style={styles.grid}>
        <div style={styles.card}>
          <h4>Tägliche Lernzeit</h4>
          <p style={styles.bigText}>{dailyLearningTime} min</p>
        </div>
        <div style={styles.card}>
          <h4>Anzahl beantworteter Karten</h4>
          <p style={styles.bigText}>{answeredCards}</p>
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
  greeting: {
    fontSize: "28px",
    fontWeight: "600",
    margin: 0,
  },
  headerRight: {
    display: "flex",
    alignItems: "center",
    gap: "24px",
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
  loginButton: {
    padding: "10px 18px",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    border: "none",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "bold",
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
  bigText: {
    fontSize: "32px",
    fontWeight: "bold",
    margin: "10px 0",
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
};

export default Dashboard;
