import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div style={{ display: "flex" }}>
        <Sidebar />
        <div style={{ marginLeft: "250px", padding: "20px", flexGrow: 1 }}>
          <Routes>
            {/* Öffentliche Routen */}
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />

            {/* Geschützte Routen */}
            <Route path="/dashboard" element={
              <ProtectedRoute><div>Dashboard Page</div></ProtectedRoute>
            } />
            <Route path="/flashcards" element={
              <ProtectedRoute><div>Flashcards Page</div></ProtectedRoute>
            } />
            <Route path="/upload" element={
              <ProtectedRoute><div>Upload Page</div></ProtectedRoute>
            } />
            <Route path="/rooms" element={
              <ProtectedRoute><div>Rooms Page</div></ProtectedRoute>
            } />
            <Route path="/progress" element={
              <ProtectedRoute><div>Progress Page</div></ProtectedRoute>
            } />
            <Route path="/exam" element={
              <ProtectedRoute><div>Exam Simulation Page</div></ProtectedRoute>
            } />
            <Route path="/settings" element={<div>Settings Page</div>} />
            
            <Route path="/profile" element={
              <ProtectedRoute><Profile /></ProtectedRoute>
            } />
            <Route path="/logout" element={<div>Logout</div>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
