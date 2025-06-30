import React from 'react';

const TutorialPage = () => {
    return (
        <div style={{
            padding: '40px',
            fontFamily: 'Arial, sans-serif',
            maxWidth: '900px',
            margin: '0 auto',
            lineHeight: '1.6',
            backgroundColor: 'var(--bg-color)', // Hintergrundfarbe aus CSS-Variablen
            color: 'var(--text-color)' // Textfarbe aus CSS-Variablen
        }}>
            <h1 style={{
                fontSize: '3.5em', // Große Überschrift
                marginBottom: '20px',
                color: 'var(--text-color)',
                fontWeight: 'bold'
            }}>
                Willkommen zum JAMHUB Tutorial!
            </h1>
            <p style={{
                fontSize: '1.2em', // Etwas größerer Einleitungstext
                marginBottom: '40px',
                color: 'var(--text-color)'
            }}>
                Hier findest du eine Anleitung, wie du die App optimal nutzen kannst.
            </p>

            <h2 style={{
                fontSize: '2em', // Überschrift für Hauptabschnitte
                marginBottom: '15px',
                color: 'var(--text-color)',
                fontWeight: 'bold'
            }}>
                1. Flashcards erstellen
            </h2>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', marginBottom: '30px', color: 'var(--text-color)' }}>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>PDF-Upload:</strong> Navigiere zu "Räume", wähle einen Raum und lade PDF-Dateien hoch.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>KI-Generierung:</strong> App extrahiert Begriffe, Definitionen & Zusammenhänge aus PDF.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Automatische Flashcards:</strong> KI schlägt strukturierte Frage-Antwort-Paare vor.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Bearbeiten:</strong> Generierte Flashcards können überprüft und angepasst werden (Frage/Antwort).
                </li>
            </ul>

            <h2 style={{
                fontSize: '2em',
                marginBottom: '15px',
                color: 'var(--text-color)',
                fontWeight: 'bold'
            }}>
                2. Lernen und Fortschritt
            </h2>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', marginBottom: '30px', color: 'var(--text-color)' }}>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Flashcards lernen:</strong> In Räumen Flashcards bearbeiten und als "gelernt" markieren.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Dashboard:</strong> Zeigt alle Flashcard-Sets und Lernfortschrittsanalyse.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Fortschrittsanzeige:</strong> Fortschrittsbalken & Diagramme visualisieren bearbeitete Karten, Meilensteine, Erfolgsquoten.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Milestones (Badges):</strong> Erreiche Lernziele und erhalte Abzeichen für deinen Erfolg.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Erinnerungen:</strong> Erhalte E-Mail-Erinnerungen zur Unterstützung deiner Progression.
                </li>
            </ul>

            <h2 style={{
                fontSize: '2em',
                marginBottom: '15px',
                color: 'var(--text-color)',
                fontWeight: 'bold'
            }}>
                3. Lernräume (Virtual Rooms)
            </h2>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', marginBottom: '30px', color: 'var(--text-color)' }}>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Eigene Räume:</strong> Jeder Nutzer kann Räume erstellen (ID & optional Passwort).
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Beitreten:</strong> Andere Nutzer treten Räumen mit ID/Passwort bei.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Nutzung & Teilen:</strong> Flashcard-Sets ansehen, verwenden, lernen (keine Bearbeitung durch Beitretende). Inhalte teilen.
                </li>
            </ul>

            <h2 style={{
                fontSize: '2em',
                marginBottom: '15px',
                color: 'var(--text-color)',
                fontWeight: 'bold'
            }}>
                4. Weitere Funktionen
            </h2>
            <ul style={{ listStyleType: 'none', paddingLeft: '0', marginBottom: '30px', color: 'var(--text-color)' }}>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Exam Simulation:</strong> Wissen testen mit Abfrage einer selbst gewählten Kartenanzahl in vorgegebener Zeit. Selbstbewertung (richtig, teilweise richtig, falsch), prozentuale Notenberechnung.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Kommentare:</strong> Kommentare zu Flashcard-Sets hinzufügen.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Dark Mode:</strong> Wechsel zwischen hellem und dunklem Modus.
                </li>
                <li style={{ marginBottom: '10px', fontSize: '1.1em' }}>
                    <strong>Leaderboard (optional):</strong> Lernfortschritt in Räumen mit anderen Nutzern vergleichen.
                </li>
            </ul>

            <p style={{
                fontSize: '1.1em',
                marginTop: '40px',
                color: 'var(--text-color)'
            }}>
                Wir hoffen, dieses Tutorial hilft dir dabei, JAMHUB optimal zu nutzen und deinen Lernerfolg zu maximieren!
            </p>
        </div>
    );
};

export default TutorialPage;