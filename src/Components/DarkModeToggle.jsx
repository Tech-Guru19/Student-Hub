import React, { useEffect, useState } from "react";

export default function DarkModeToggle() {
    const [dark, setDark] = useState(false);

    useEffect(() => {
        document.body.className = dark ? "bg-dark text-white" : "bg-light text-dark";
    }, [dark]);

    return (
        <button
            className={`btn ${dark ? "btn-light" : "btn-dark"}`}
            onClick={() => setDark(!dark)}
        >
            {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
    );
}
