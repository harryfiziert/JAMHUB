import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const RoomDiagram = ({ roomId, refreshKey }) => {
    const [data, setData] = useState([]);

    useEffect(() => {
        fetch(`http://localhost:8000/leaderboard/${roomId}`)
            .then(res => res.json())
            .then(setData)
            .catch(err => console.error("Fehler beim Laden des Diagramms:", err));
    }, [roomId, refreshKey]);

    const chartData = {
        labels: data.map(entry => entry.username),
        datasets: [
            {
                label: "Gelernte Karten",
                data: data.map(entry => entry.learned_count),
                backgroundColor: "rgba(100, 149, 237, 0.8)", // cornflowerblue
                borderRadius: 5,
                barThickness: 40
            }
        ]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    color: "#ccc",
                    font: { size: 12 }
                }
            },
            title: {
                display: true,
                text: "Lernfortschritt im Raum",
                color: "#ccc",
                font: {
                    size: 16,
                    weight: "bold"
                }
            }
        },
        scales: {
            x: {
                ticks: {
                    color: "#ccc"
                },
                grid: {
                    color: "#444"
                }
            },
            y: {
                beginAtZero: true,
                ticks: {
                    color: "#ccc",
                    stepSize: 1
                },
                grid: {
                    color: "#444"
                }
            }
        }
    };

    return (
        <div style={{ height: "300px", marginTop: "40px", padding: "10px" }}>
            <Bar data={chartData} options={options} />
        </div>
    );
};

export default RoomDiagram;
