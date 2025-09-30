import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

export default function Signup() {
    const navigate = useNavigate();
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleSignup = (e) => {
        e.preventDefault();

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Check if username already exists
        const exists = users.find((u) => u.username === username);
        if (exists) {
            alert("Username already exists! Please choose another one.");
            return;
        }

        const newUser = { fullName, username, password };
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert("Signup successful! Please login.");
        navigate("/login");
    };

    return (
        <div className="auth-container">
            <div className="auth-form">
                <h2>Student Signup</h2>
                <form onSubmit={handleSignup}>
                    <div className="mb-3">
                        <label className="form-label">Full Name</label>
                        <input
                            type="text"
                            className="form-control"
                            value={fullName}
                            onChange={(e) => setFullName(e.target.value)}
                            placeholder="Enter your full name"
                            required
                        />
                    </div>

                    <div className="mb-3">
                        <label className="form-label">Username</label>
                        <input
                            type="text"
                            className="form-control"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            placeholder="Enter username"
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

                    <button type="submit" className="btn btn-primary w-100">
                        Sign Up
                    </button>
                </form>
                <p>
                    Already have an account?{" "}
                    <a href="/login" className="text-decoration-none">
                        Login here
                    </a>
                </p>
            </div>
        </div>
    );
}
