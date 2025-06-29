import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Settings from "./components/Settings";
import VirtualRoomActions from "./components/VirtualRoomActions";
import VirtualRoomPage from "./components/VirtualRoomPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Flashcards from "./components/Flashcard";
import ExamSimulation from "./components/ExamSimulation";
import Upload from "./components/Upload";
import { auth } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";
import RoomView from "./components/RoomView"; // ✅ neue Komponente importieren
import LearnView from "./components/LearnView";
import Badges from "./components/Badges";

function App() {
    const [user, setUser] = useState(undefined); // undefined = loading

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            setUser(firebaseUser);
        });

        return () => unsubscribe();
    }, []);

    return (
        <Router>
            <div style={{ display: "flex", height: "100vh", width: "100%" }}>
                {/* Sidebar nur anzeigen wenn eingeloggt */}
                {user !== undefined && user && (
                    <div style={{ width: "250px" }}>
                        <Sidebar />
                    </div>
                )}

                {/* Hauptinhalt */}
                <div
                    style={{
                        flexGrow: 1,
                        width: "100%",
                        display: "flex",
                        flexDirection: "column",
                        overflowX: "hidden",
                        backgroundColor: "var(--bg-color)",
                        color: "var(--text-color)",
                    }}
                >
                    <Routes>
                        {/* Öffentliche Seiten */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Geschützte Seiten */}
                        <Route
                            path="/dashboard"
                            element={
                                <ProtectedRoute>
                                    <Dashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/upload"
                            element={
                                <ProtectedRoute>
                                    <Upload />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/flashcards"
                            element={
                                <ProtectedRoute>
                                    <Flashcards />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/rooms"
                            element={
                                <ProtectedRoute>
                                    <VirtualRoomPage />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/Badges"
                            element={
                                <ProtectedRoute>
                                    <Badges />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/exam"
                            element={
                                <ProtectedRoute>
                                    <ExamSimulation />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                <ProtectedRoute>
                                    <Settings />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/room/create"
                            element={
                                <ProtectedRoute>
                                    <VirtualRoomActions />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/room/join"
                            element={
                                <ProtectedRoute>
                                    <VirtualRoomActions />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/room/:roomId"
                            element={
                                <ProtectedRoute>
                                    <RoomView />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/learn/:roomId"
                            element={
                            <LearnView />
                            }
                        />

                        {/* Startseite umleiten */}
                        <Route path="/" element={<Navigate to="/login" />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
