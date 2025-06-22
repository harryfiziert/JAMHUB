import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Sidebar from "./components/SideBar";
import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";
import Upload from "./components/Upload";
import Settings from "./components/Settings";
import VirtualRoomActions from "./components/VirtualRoomActions";
import VirtualRoomPage from "./components/VirtualRoomPage";
import ProtectedRoute from "./components/ProtectedRoute";
import Flashcards from "./components/Flashcard";
import ExamSimulation from "./components/ExamSimulation"; // ✅ New import
import { auth } from "./Firebase";
import { onAuthStateChanged } from "firebase/auth";

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
                {/* Sidebar only if loaded and logged in */}
                {user !== undefined && user && (
                    <div style={{ width: "250px" }}>
                        <Sidebar />
                    </div>
                )}

                {/* Main content */}
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
                        {/* Public Routes */}
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Protected Routes */}
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
                            path="/progress"
                            element={
                                <ProtectedRoute>
                                    <div>Progress Page</div>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/exam"
                            element={
                                <ProtectedRoute>
                                    <ExamSimulation /> {/* ✅ Replaced div with actual component */}
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
                    </Routes>
                </div>
            </div>
        </Router>
    );
}

export default App;
