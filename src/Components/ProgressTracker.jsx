import React from "react";

export default function ProgressTracker({ tasks }) {
    const completed = tasks.filter((t) => t.completed).length;
    const total = tasks.length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    return (
        <div className="mt-3">
            <h6>📊 Progress Tracker</h6>
            <div className="progress">
                <div
                    className="progress-bar"
                    style={{ width: `${percent}%` }}
                >
                    {percent}%
                </div>
            </div>
        </div>
    );
}
