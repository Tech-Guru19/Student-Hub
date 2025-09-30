import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

export default function CalendarView({ tasks }) {
    const [date, setDate] = useState(new Date());

    const tasksForDate = tasks.filter((task) => task.deadline === date.toISOString().split("T")[0]);

    return (
        <div className="card p-3 shadow">
            <h5>📅 Calendar</h5>
            <Calendar value={date} onChange={setDate} />
            <div className="mt-3">
                <h6>Tasks on {date.toDateString()}:</h6>
                <ul>
                    {tasksForDate.length > 0 ? (
                        tasksForDate.map((task, i) => <li key={i}>{task.text}</li>)
                    ) : (
                        <li>No tasks</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
