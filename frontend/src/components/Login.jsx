import React, { useState, useEffect } from "react";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { auth } from "../Firebase";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // Automatische Weiterleitung falls eingeloggt
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        navigate("/dashboard");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    let emailToUse = emailOrUsername;

    try {
      // Falls Eingabe kein @ enthält → ist es vermutlich ein Benutzername
      if (!emailOrUsername.includes("@")) {
        const res = await fetch(`http://localhost:8000/user/by-username/${emailOrUsername}`);
        if (!res.ok) {
          throw new Error("Benutzername nicht gefunden");
        }
        const data = await res.json();
        emailToUse = data.email;
      }

      await signInWithEmailAndPassword(auth, emailToUse, password);
      // Weiterleitung erfolgt durch useEffect
    } catch (error) {
      setMessage("Login fehlgeschlagen: " + error.message);
      console.error("Login Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Login</h2>
      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="E-Mail oder Benutzername"
          value={emailOrUsername}
          onChange={(e) => setEmailOrUsername(e.target.value)}
          style={styles.input}
          required
        />

        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
          required
        />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Einloggen..." : "Login"}
        </button>
      </form>

      {message && <p style={styles.message}>{message}</p>}

      <p style={styles.linkText}>
        Noch keinen Account?{" "}
        <a href="/register" style={styles.link}>
          Jetzt registrieren
        </a>
      </p>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "400px",
    margin: "60px auto",
    padding: "20px",
    borderRadius: "8px",
    backgroundColor: "#f8f8f8",
    boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    textAlign: "center",
  },
  title: {
    marginBottom: "20px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    fontSize: "16px",
    border: "1px solid #ccc",
    borderRadius: "4px",
  },
  button: {
    padding: "10px",
    fontSize: "16px",
    backgroundColor: "#1e1e2f",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    cursor: "pointer",
  },
  message: {
    marginTop: "16px",
    color: "red",
  },
  linkText: {
    marginTop: "20px",
    fontSize: "14px",
  },
  link: {
    color: "blue",
    textDecoration: "underline",
  },
};

export default Login;
