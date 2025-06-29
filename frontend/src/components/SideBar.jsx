import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

  // Wendet beim Laden direkt den aktuellen Modus auf body an
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleMode = () => {
    setDarkMode(prevMode => {
      const newMode = !prevMode;
      document.body.classList.toggle("dark", newMode);
      return newMode;
    });
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
      <div className="sidebar">
        {/* Top Section */}
        <div>
          <h2 className="sidebar-title">LernApp</h2>

          <nav className="sidebar-nav">
            <div className="sidebar-section">
              <div className="sidebar-section-title">Overview</div>
              <div className="sidebar-sublinks">
                <Link to="/dashboard">Summary</Link>
                <Link to="/custom">Custom view</Link>
              </div>
            </div>

            <div className="sidebar-section">
              <Link to="/flashcards">Flashcards</Link>
              <Link to="/upload">Upload</Link>
              <Link to="/rooms">Räume</Link>
              <Link to="/badges">Badges</Link>
              <Link to="/exam">Exam Simulation</Link>
            </div>

            <hr className="sidebar-divider" />

            <div className="sidebar-section">
              <Link to="/settings">Settings</Link>
            </div>

            <div className="sidebar-toggle-wrapper">
              <div className="sidebar-toggle" onClick={toggleMode}>
                <span style={{ opacity: darkMode ? 0.3 : 1 }}>🌞</span>
                <span className="sidebar-toggle-slider" />
                <span style={{ opacity: darkMode ? 1 : 0.3 }}>🌙</span>
              </div>
            </div>
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="sidebar-bottom">
          <div className="sidebar-tutorial">Webapp – Tutorial</div>
          <button onClick={handleLogout} className="sidebar-logout">
            Log out
          </button>
        </div>
      </div>
  );
};

export default Sidebar;
