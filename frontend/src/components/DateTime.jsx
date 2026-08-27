import { useState } from "react";
import "./DateTime.css";

function DateTime({ onNext }) {
    const [date, setDate] = useState("");
    const [time, setTime] = useState("");

    const handleNext = () => {
        if (!date || !time) {
            alert("Please select a date and time ❤️");
            return;
        }

        onNext({
            date: date,
            time: time
        });
    };

    return (
        <div className="datetime-page">

            {/* Background decorations */}

            <div className="datetime-hearts">
                <span>♥</span>
                <span>♡</span>
                <span>♥</span>
                <span>♡</span>
                <span>♥</span>
            </div>

            <div className="datetime-sparkles">
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
            </div>
            <div className="datetime-stars">
                <span className="dt-star dt-star-1">★</span>
                <span className="dt-star dt-star-2">★</span>
                <span className="dt-star dt-star-3">★</span>
                <span className="dt-sparkle dt-sparkle-1">✦</span>
                <span className="dt-sparkle dt-sparkle-2">✧</span>
                <span className="dt-sparkle dt-sparkle-3">✦</span>
                <span className="dt-sparkle dt-sparkle-4">✧</span>
            </div>

            {/* Main Card */}

            <div className="datetime-card">

                <div className="datetime-icon">
                    ☕
                </div>
                <div className="datetime-heart">
                    ♡
                </div>
                <h1>
                    When should we go? 💕
                </h1>
                <p>
                    Pick a date and time for our little coffee date ☕
                </p>

                {/* Date */}

                <div className="datetime-input-group">
                    <label>
                        📅 Pick a date
                    </label>
                    <input
                        type="date"
                        value={date}
                        min={new Date().toISOString().split("T")[0]}
                        onChange={(event) =>
                            setDate(event.target.value)
                        }
                    />
                </div>

                {/* Time */}

                <div className="datetime-input-group">
                    <label>
                        ⏰ Pick a time
                    </label>
                    <input
                        type="time"
                        value={time}
                        onChange={(event) =>
                            setTime(event.target.value)
                        }
                    />
                </div>
                <button
                    className="next-button"
                    onClick={handleNext}
                >
                    Continue 💕
                </button>
                <div className="datetime-bottom-heart">
                    ♥
                </div>
            </div>
        </div>
    );
}
export default DateTime;