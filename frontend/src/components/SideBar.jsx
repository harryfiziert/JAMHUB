import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../Firebase";

const Sidebar = () => {
  const [darkMode, setDarkMode] = useState(true);
  const navigate = useNavigate();

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

  const handleTutorialClick = () => {
    navigate('/tutorial');
  };

  return (
      <div className="sidebar">
        <div>
          <h2 className="sidebar-title">JAMHUB</h2>

          <nav className="sidebar-nav">

            <div className="sidebar-section">
              <Link to="/dashboard">Dashboard</Link>
            </div>

            <div className="sidebar-section">

              <Link to="/rooms">Räume</Link>
              <Link to="/badges">Badges</Link>
              <Link to="/exam">Exam Simulation</Link>
            </div>

            <hr className="sidebar-divider"/>

            <div className="sidebar-section">
              <Link to="/settings">Settings</Link>
            </div>

            <div className="sidebar-toggle-wrapper">
              <div className="sidebar-toggle" onClick={toggleMode}>
                <span style={{opacity: darkMode ? 0.3 : 1}}>🌞</span>
                <span className="sidebar-toggle-slider"/>
                <span style={{opacity: darkMode ? 1 : 0.3}}>🌙</span>
              </div>
            </div>
          </nav>
        </div>

        <div className="sidebar-bottom">
          <button onClick={handleTutorialClick} className="sidebar-tutorial-button">
            Webapp – Tutorial
          </button>
          <button onClick={handleLogout} className="sidebar-logout">
            Log out
          </button>
        </div>
      </div>
  );
};

export default Sidebar;