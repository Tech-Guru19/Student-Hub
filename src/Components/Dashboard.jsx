// Dashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Motivation from "./Motivation";
import Notes from "./Notes";
import CalendarView from "./CalenderView";
import ProgressTracker from "./ProgressTracker";

export default function Dashboard() {
    const navigate = useNavigate();

    const [greeting, setGreeting] = useState("");
    const [darkMode, setDarkMode] = useState(false);

    const currentUser = JSON.parse(localStorage.getItem("currentUser"));
    const username = currentUser?.username;

    const [tasks, setTasks] = useState(() => {
        if (!username) return [];
        const saved = localStorage.getItem(`tasks_${username}`);
        return saved ? JSON.parse(saved) : [];
    });


    const [timeLeft, setTimeLeft] = useState(0);
    const [isRunning, setIsRunning] = useState(false);
    const [inputTime, setInputTime] = useState(""); // NEW for input field
    const [alarmInstance, setAlarmInstance] = useState(null);
    const [isRinging, setIsRinging] = useState(false);


    const [currentTask, setCurrentTask] = useState(null);
    const [taskTimeLeft, setTaskTimeLeft] = useState(0);
    const [reminder, setReminder] = useState(null);


    const playAlarm = () => {
        const alarm = new Audio("/alarm.wav");
        alarm.loop = true;
        alarm.play().catch((err) => console.log("Alarm blocked:", err));
        setAlarmInstance(alarm);
        setIsRinging(true);
    };

    
    const stopAlarm = () => {
        if (alarmInstance) {
            alarmInstance.pause();
            alarmInstance.currentTime = 0;
            setAlarmInstance(null);
        }
        setIsRinging(false);
    };

    
    useEffect(() => {
        if (!currentUser) {
            navigate("/login");
            return;
        }
        const hours = new Date().getHours();
        if (hours < 12) setGreeting("Good morning");
        else if (hours < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
    }, [navigate, currentUser]);

    
    useEffect(() => {
        if (!username) return;
        localStorage.setItem(`tasks_${username}`, JSON.stringify(tasks));

        const now = Date.now();
        const upcomingTasks = tasks
            .filter((t) => t.deadline && !t.completed)
            .map((t) => ({
                ...t,
                secondsLeft: Math.floor((new Date(t.deadline).getTime() - now) / 1000),
            }))
            .filter((t) => t.secondsLeft > 0)
            .sort((a, b) => a.secondsLeft - b.secondsLeft);

        if (upcomingTasks.length > 0) {
            setCurrentTask(upcomingTasks[0]);
            setTaskTimeLeft(upcomingTasks[0].secondsLeft);
        } else {
            setCurrentTask(null);
            setTaskTimeLeft(0);
        }
    }, [tasks, username]);

    
    useEffect(() => {
        if (!currentTask) return;

        const interval = setInterval(() => {
            setTaskTimeLeft((prev) => {
                if (prev <= 1) {
                    setTasks((prevTasks) => {
                        const idx = prevTasks.findIndex(
                            (t) =>
                                t.text === currentTask.text &&
                                t.deadline === currentTask.deadline &&
                                !t.completed
                        );
                        if (idx === -1) return prevTasks;
                        const newTasks = [...prevTasks];
                        newTasks[idx] = { ...newTasks[idx], completed: true };
                        return newTasks;
                    });

                    setReminder({
                        text: currentTask.text,
                        deadline: currentTask.deadline,
                    });

                    playAlarm();
                    return 0;
                }
                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(interval);
    }, [currentTask]);

    
    useEffect(() => {
        if (!reminder) return;
        const t = setTimeout(() => {
            setReminder(null);
            stopAlarm();
        }, 15000);
        return () => clearTimeout(t);
    }, [reminder]);

    
    useEffect(() => {
        let timer;
        if (isRunning && timeLeft > 0) {
            timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
        } else if (timeLeft === 0 && isRunning) {
            setIsRunning(false);
            playAlarm();
        }
        return () => clearInterval(timer);
    }, [isRunning, timeLeft]);

    
    const resetTimer = () => {
        stopAlarm();
        setIsRunning(false);
        setTimeLeft(0);
        setInputTime("");
    };

    const handleLogout = () => {
        localStorage.removeItem("currentUser");
        localStorage.removeItem("isLoggedIn");
        navigate("/login");
    };

    const toggleDarkMode = () => {
        setDarkMode((d) => !d);
        document.body.classList.toggle("bg-dark");
        document.body.classList.toggle("text-light");
    };

    const formatTime = (secs) => {
        if (!secs || secs <= 0) return "00:00:00";
        const h = Math.floor(secs / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        return `${h.toString().padStart(2, "0")}:${m
            .toString()
            .padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    };

    const otherTasks = tasks
        .filter((t) => t.deadline && !t.completed)
        .map((t) => ({
            ...t,
            secondsLeft: Math.floor((new Date(t.deadline).getTime() - Date.now()) / 1000),
        }))
        .filter((t) =>
            currentTask
                ? !(t.text === currentTask.text && t.deadline === currentTask.deadline)
                : true
        )
        .filter((t) => t.secondsLeft > 0)
        .sort((a, b) => a.secondsLeft - b.secondsLeft);

    return (
        <div className="container mt-5">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <div>
                    <h2>
                        {greeting}, {currentUser?.fullName || currentUser?.username || "Student"} 👋
                    </h2>
                </div>
                <div className="d-flex gap-2">
                    <button className="btn btn-secondary" onClick={toggleDarkMode}>
                        {darkMode ? "☀️ Light" : "🌙 Dark"}
                    </button>
                    <button className="btn btn-danger" onClick={handleLogout}>
                        Logout
                    </button>
                </div>
            </div>

            <Motivation />

            {reminder && (
                <div className="alert alert-info text-center mt-3">
                    ⏰ Reminder: Time to do <strong>{reminder.text}</strong>!
                </div>
            )}

            <ProgressTracker tasks={tasks} />

            <div className="row mt-4">
                <div className="col-md-6 mb-4">
                    <Notes tasks={tasks} setTasks={setTasks} />
                </div>
                <div className="col-md-6 mb-4">
                    <CalendarView tasks={tasks} />
                </div>
            </div>

            
            <div className="card p-3 shadow mt-4">
                <h4>⏳ Study Timer</h4>
                <input
                    type="number"
                    className="form-control my-2"
                    placeholder="Enter time in seconds"
                    value={inputTime}
                    onChange={(e) => setInputTime(e.target.value)}
                />
                <button
                    className="btn btn-success me-2"
                    onClick={() => {
                        if (!inputTime || isNaN(inputTime) || inputTime <= 0) {
                            alert("Enter a valid time in seconds!");
                            return;
                        }
                        stopAlarm(); 
                        setTimeLeft(Number(inputTime));
                        setIsRunning(true);
                    }}
                    disabled={isRunning}
                >
                    Start
                </button>
                <button className="btn btn-warning me-2" onClick={resetTimer}>
                    Reset
                </button>

                {isRinging && (
                    <button className="btn btn-danger me-2" onClick={stopAlarm}>
                        Stop Alarm
                    </button>
                )}

                <h3 className="mt-3">{formatTime(timeLeft)}</h3>
            </div>

            {currentTask && (
                <div className="card p-3 shadow mt-4 border-info mb-3">
                    <h4>📌 Next Upcoming Task</h4>
                    <p>
                        Task: <strong>{currentTask.text}</strong> <br />
                        Deadline: {new Date(currentTask.deadline).toLocaleString()}
                    </p>
                    <h3 className="mt-3 text-primary">{formatTime(taskTimeLeft)}</h3>
                    {taskTimeLeft === 0 && (
                        <div className="alert alert-info mt-2">
                            ⏰ Reminder: Time to do <strong>{currentTask.text}</strong>!
                        </div>
                    )}
                </div>
            )}

            {otherTasks.length > 0 && (
                <div className="card p-3 shadow mt-2 mb-5 border-secondary">
                    <h5>🗓️ Other Upcoming Tasks</h5>
                    <ul className="list-group mt-2">
                        {otherTasks.map((task, index) => (
                            <li
                                key={index}
                                className="list-group-item d-flex justify-content-between"
                            >
                                <span>{task.text}</span>
                                <span className="text-muted">{formatTime(task.secondsLeft)}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
}
