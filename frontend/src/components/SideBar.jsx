import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";


const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  const toggleMode = () => setDarkMode(!darkMode);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div style={styles.sidebar}>
      {/* Top Section */}
      <div>
        <h2 style={styles.title}>LernApp</h2>

        <nav style={styles.nav}>
          <div style={styles.section}>
            <div style={styles.sectionTitle}>Overview</div>
            <div style={styles.subLinks}>
              <Link to="/dashboard" style={styles.link}>Summary</Link>
              <Link to="/custom" style={styles.link}>Custom view</Link>
            </div>
          </div>

          <div style={styles.section}>
            <Link to="/flashcards" style={styles.link}>Flashcards</Link>
            <Link to="/upload" style={styles.link}>Upload</Link>
            <Link to="/rooms" style={styles.link}>Räume</Link>
            <Link to="/progress" style={styles.link}>Fortschritt</Link>
            <Link to="/exam" style={styles.link}>Exam Simulation</Link>
          </div>

          <hr style={styles.divider} />

          <div style={styles.section}>
            <Link to="/settings" style={styles.link}>Settings</Link>
          </div>

          <div style={styles.toggleWrapper}>
            <div style={styles.toggle} onClick={toggleMode}>
              <span style={{ opacity: darkMode ? 1 : 0.3 }}>🌞</span>
              <span style={styles.toggleSlider}></span>
              <span style={{ opacity: darkMode ? 0.3 : 1 }}>🌙</span>
            </div>
          </div>
        </nav>
      </div>

      {/* Bottom Section */}
      <div style={styles.bottomArea}>
        <div style={styles.tutorial}>Webapp - Tutorial</div>
        <button
          onClick={handleLogout}
          style={{
            ...styles.link,
            color: "red",
            marginTop: "8px",
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
          }}
        >
          Log out
        </button>
      </div>
    </div>
  );
};

const styles = {
  sidebar: {
    width: "250px",
    height: "100vh",
    backgroundColor: "#1e1e2f",
    color: "white",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: "24px 20px",
    boxSizing: "border-box",
  },
  title: {
    fontSize: "24px",
    fontWeight: "bold",
    marginBottom: "32px",
  },
  nav: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  section: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  sectionTitle: {
    fontWeight: "600",
    fontSize: "16px",
  },
  subLinks: {
    display: "flex",
    flexDirection: "column",
    paddingLeft: "16px",
    gap: "8px",
    marginTop: "6px",
  },
  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
  },
  divider: {
    border: "none",
    borderTop: "1px solid #444",
    margin: "20px 0",
  },
  toggleWrapper: {
    marginTop: "4px",
  },
  toggle: {
    backgroundColor: "#333",
    borderRadius: "30px",
    width: "70px",
    height: "32px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 10px",
    cursor: "pointer",
  },
  toggleSlider: {
    width: "18px",
    height: "18px",
    borderRadius: "50%",
    backgroundColor: "white",
  },
  bottomArea: {
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-start",
    fontSize: "14px",
    color: "#aaa",
  },
  tutorial: {
    marginBottom: "4px",
  },
};

export default Sidebar;
