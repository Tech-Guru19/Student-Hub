import React from "react";
import { useNavigate } from "react-router-dom";

export default function HeroSection() {
    const navigate = useNavigate();

    return (
        <div
            className="d-flex flex-column justify-content-center align-items-center text-center"
            style={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea, #764ba2)",
                color: "#fff",
                padding: "2rem",
                position: "relative",
            }}
        >
            <div style={{ position: "absolute", top: 20, right: 20, display: "flex", gap: "10px" }}>
                <button
                    className="btn btn-outline-light"
                    onClick={() => navigate("/login")}
                >
                    Login
                </button>
                <button
                    className="btn btn-light"
                    onClick={() => navigate("/signup")}
                >
                    Sign Up
                </button>
            </div>

            <h1 className="display-4 mb-3">Welcome to Student Hub</h1>
            <p className="lead mb-4">Organize your study, track your progress, and stay motivated.</p>
            <button
                className="btn btn-primary btn-lg"
                onClick={() => navigate("/dashboard")}
            >
                Add Tasks / Go to Dashboard
            </button>
        </div>
    );
}
