import React, { useEffect, useState } from "react";

export default function Motivation() {
    const quotes = [
        "Success is the sum of small efforts, repeated day in and day out.",
        "Don’t watch the clock; do what it does. Keep going.",
        "The secret of getting ahead is getting started.",
        "Push yourself, because no one else is going to do it for you.",
        "Great things never come from comfort zones.",
        "Study hard, for the well is deep, and our brains are shallow. – Richard Baxter",
        "Dreams don’t work unless you do.",
        "Every expert was once a beginner.",
        "Small progress each day adds up to big results."
    ];

    const [quote, setQuote] = useState("");

    useEffect(() => {
        const random = quotes[Math.floor(Math.random() * quotes.length)];
        setQuote(random);
    }, []);

    return (
        <div className="alert alert-info mt-3">
            <strong>💡 Motivation:</strong> {quote}
        </div>
    );
}
