import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Register from "./components/Register";

<Route path="/register" element={<Register />} />

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "250px", padding: "20px" }}>
          <Routes>
            {/* Add your routes here */}
            <Route path="/dashboard" element={<div>Dashboard Page</div>} />
            <Route path="/flashcards" element={<div>Flashcards Page</div>} />
            <Route path="/upload" element={<div>Upload Page</div>} />
            <Route path="/rooms" element={<div>Rooms Page</div>} />
            <Route path="/progress" element={<div>Progress Page</div>} />
            <Route path="/exam" element={<div>Exam Simulation Page</div>} />
            <Route path="/settings" element={<div>Settings Page</div>} />
            <Route path="/logout" element={<div>Logout</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
