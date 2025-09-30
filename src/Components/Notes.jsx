import React, { useState } from "react";

export default function Notes({ tasks, setTasks }) {
    const [note, setNote] = useState("");
    const [deadline, setDeadline] = useState("");

    const addTask = () => {
        if (!note) return;
        const newTask = { text: note, deadline, completed: false };
        setTasks([...tasks, newTask]);
        setNote("");
        setDeadline("");
    };

    const toggleTask = (index) => {
        const newTasks = [...tasks];
        newTasks[index].completed = !newTasks[index].completed;
        setTasks(newTasks);
    };

    const deleteTask = (index) => {
        setTasks(tasks.filter((_, i) => i !== index));
    };

    return (
        <div className="card p-3 shadow">
            <h5>📝 Notes & Tasks</h5>
            <input
                type="text"
                className="form-control mb-2"
                placeholder="Enter task"
                value={note}
                onChange={(e) => setNote(e.target.value)}
            />
            <input
                type="date"
                className="form-control mb-2"
                value={deadline}
                onChange={(e) => setDeadline(e.target.value)}
            />
            <button className="btn btn-success mb-3" onClick={addTask}>
                Add Task
            </button>

            <ul className="list-group">
                {tasks.map((task, index) => (
                    <li
                        key={index}
                        className={`list-group-item d-flex justify-content-between ${task.completed ? "list-group-item-success" : ""
                            }`}
                    >
                        <span>
                            <input
                                type="checkbox"
                                className="me-2"
                                checked={task.completed}
                                onChange={() => toggleTask(index)}
                            />
                            {task.text} {task.deadline && `📅 ${task.deadline}`}
                        </span>
                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => deleteTask(index)}
                        >
                            ❌
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
