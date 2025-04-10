import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>StudyApp</h2>
      <nav style={styles.nav}>
        <Link to="/dashboard" style={styles.link}>Overview</Link>
        <Link to="/flashcards" style={styles.link}>Flashcards</Link>
        <Link to="/upload" style={styles.link}>Upload</Link>
        <Link to="/rooms" style={styles.link}>Rooms</Link>
        <Link to="/progress" style={styles.link}>Progress</Link>
        <Link to="/exam" style={styles.link}>Exam Simulation</Link>
        <Link to="/settings" style={styles.link}>Settings</Link>
        <Link to="/profile" style={styles.link}>Profile</Link>
        <Link to="/login" style={styles.link}>Login</Link>
        <Link to="/logout" style={{ ...styles.link, color: "red" }}>Logout</Link>
      </nav>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    backgroundColor: "#1e1e2f",
    color: "white",
    padding: "20px",
    position: "static",
    top: 0,
    left: 0,
  },
  title: {
    fontSize: "24px",
    marginBottom: "30px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "18px",
  },
};

export default Sidebar;
