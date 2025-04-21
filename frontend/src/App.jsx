import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";

function App() {
  return (
      <Router>
        <div style={{ display: "flex", height: "100vh", width: "100%" }}>
          {/* Sidebar mit fixer Breite */}
          <div style={{ width: "250px" }}>
            <Sidebar />
          </div>

          {/* Hauptinhalt mit voller Breite */}
          <div
              style={{
                flexGrow: 1,
                width: "100%",
                display: "flex",
                flexDirection: "column",
                overflowX: "hidden",
              }}
          >
            <Routes>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/upload" element={<Upload />} />
              <Route path="/flashcards" element={<div>Flashcards Page</div>} />
              <Route path="/rooms" element={<div>Rooms Page</div>} />
              <Route path="/progress" element={<div>Progress Page</div>} />
              <Route path="/exam" element={<div>Exam Simulation Page</div>} />
              <Route path="/settings" element={<div>Settings Page</div>} />
              <Route path="/logout" element={<div>Logout</div>} />
              <Route path="/register" element={<Register />} />
              <Route path="/login" element={<Login />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
