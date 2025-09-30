import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Login({ onLogin }) {
    const navigate = useNavigate();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        const isLoggedIn = localStorage.getItem("isLoggedIn");
        const currentUser = JSON.parse(localStorage.getItem("currentUser"));
        if (isLoggedIn && currentUser) {
            navigate("/dashboard");
        }
    }, [navigate]);

    const handleLogin = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];
        const storedUser = users.find(
            (u) => u.username === username && u.password === password
        );

        if (storedUser) {
            localStorage.setItem("currentUser", JSON.stringify(storedUser));
            localStorage.setItem("isLoggedIn", "true");
            onLogin(storedUser.fullName);
            navigate("/dashboard");
        } else {
            alert("Invalid credentials. Please try again.");
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Student Login</h2>
                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter your username"
                            required
                        />
                    </div>
                    <div className="mb-3">
                        <label className="form-label">Password</label>
                        <div className="input-group">
                            <input
                                type={showPassword ? "text" : "password"}
                                className="form-control"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter your password"
                                required
                            />
                            <span
                                className="input-group-text"
                                style={{ cursor: "pointer" }}
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </span>
                        </div>
                    </div>
                    <button type="submit" className="btn btn-success w-100">
                        Login
                    </button>
                </form>
                <p>
                    Don’t have an account?{" "}
                    <a href="/signup" className="text-decoration-none">
                        Sign up here
                    </a>
                </p>
            </div>
        </div>
    );
}
