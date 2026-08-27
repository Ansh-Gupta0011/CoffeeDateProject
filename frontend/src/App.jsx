import { useState } from "react";
import "./App.css";

import DateTime from "./components/DateTime";
import CafeMap from "./components/CafeMap";
import Confirmation from "./components/Confirmation";

function App() {
    const [page, setPage] = useState(1);

    const [selectedCafe, setSelectedCafe] = useState(null);

    const [noPosition, setNoPosition] = useState(null);
    const [pathPoints, setPathPoints] = useState([]);

    const [dateTime, setDateTime] = useState({
        date: "",
        time: ""
    });

    // =====================================================
    // NO BUTTON MOVEMENT
    // =====================================================

    const moveNoButton = () => {
        const buttonWidth = 180;
        const buttonHeight = 72;
        const margin = 25;

        const maxX =
            window.innerWidth -
            buttonWidth -
            margin;

        const maxY =
            window.innerHeight -
            buttonHeight -
            margin;

        let newX;
        let newY;

        do {
            newX =
                margin +
                Math.random() *
                    (maxX - margin);

            newY =
                margin +
                Math.random() *
                    (maxY - margin);

        } while (
            noPosition &&
            Math.abs(newX - noPosition.x) < 200 &&
            Math.abs(newY - noPosition.y) < 150
        );

        const newPosition = {
            x: newX,
            y: newY
        };

        // First movement
        if (!noPosition) {
            const startX =
                window.innerWidth / 2 + 100;

            const startY =
                window.innerHeight / 2 + 70;

            setPathPoints([
                {
                    x: startX,
                    y: startY
                },
                {
                    x:
                        newX +
                        buttonWidth / 2,
                    y:
                        newY +
                        buttonHeight / 2
                }
            ]);

        } else {
            setPathPoints(previous => [
                ...previous,
                {
                    x:
                        newX +
                        buttonWidth / 2,
                    y:
                        newY +
                        buttonHeight / 2
                }
            ]);
        }

        setNoPosition(newPosition);
    };

    // =====================================================
    // CREATE SVG PATH
    // =====================================================

    const createPath = () => {
        if (pathPoints.length < 2) {
            return "";
        }

        let path = `
            M ${pathPoints[0].x}
              ${pathPoints[0].y}
        `;

        for (
            let i = 1;
            i < pathPoints.length;
            i++
        ) {
            const previous =
                pathPoints[i - 1];

            const current =
                pathPoints[i];

            const controlX =
                (previous.x + current.x) / 2;

            const controlY =
                previous.y;

            path += `
                Q
                ${controlX}
                ${controlY}
                ${current.x}
                ${current.y}
            `;
        }

        return path;
    };

    // =====================================================
    // SCREEN 2
    // =====================================================

    if (page === 2) {
        return (
            <DateTime
                onNext={(data) => {
                    console.log(
                        "Selected date/time:",
                        data
                    );

                    setDateTime(data);

                    // Go to Screen 3
                    setPage(3);
                }}
            />
        );
    }

    // =====================================================
    // SCREEN 3
    // =====================================================
    if (page === 3) {
        return (
            <CafeMap
                dateTime={dateTime}
                onCafeSelect={(cafe) => {
                    console.log("Cafe saved, opening Screen 4:", cafe);

                    setSelectedCafe(cafe);
                    setPage(4);
                }}
            />
        );
    }


    // ==============================
    // SCREEN 4
    // ==============================
   if (page === 4) {
        return (
            <Confirmation
                dateTime={dateTime}
                selectedCafe={selectedCafe}
            />
        );
    }

    // =====================================================
    // SCREEN 1
    // =====================================================

    return (
        <div className="coffee-page">

            {/* =========================================
                BACKGROUND GLOW
            ========================================== */}

            <div className="background-glow glow-one"></div>
            <div className="background-glow glow-two"></div>
            <div className="background-glow glow-three"></div>

            {/* =========================================
                STARS
            ========================================== */}

            <div className="stars">

                <span className="big-star star-a">
                    ★
                </span>

                <span className="big-star star-b">
                    ★
                </span>

                <span className="big-star star-c">
                    ★
                </span>

                <span className="small-star star-d">
                    ✦
                </span>

                <span className="small-star star-e">
                    ✦
                </span>

                <span className="small-star star-f">
                    ✦
                </span>

                <span className="small-star star-g">
                    ✦
                </span>

                <span className="small-star star-h">
                    ✦
                </span>

            </div>

            {/* =========================================
                SPARKLES
            ========================================== */}

            <div className="sparkles">

                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>

            </div>

            {/* =========================================
                FLOATING HEARTS
            ========================================== */}

            <div className="floating-hearts">

                <span>♥</span>
                <span>♡</span>
                <span>♥</span>
                <span>♡</span>
                <span>♥</span>
                <span>♡</span>
                <span>♥</span>
                <span>♡</span>

            </div>

            {/* =========================================
                NO BUTTON MOVEMENT PATH
            ========================================== */}

            {pathPoints.length > 1 && (
                <svg
                    className="no-path"
                    viewBox={`
                        0 0
                        ${window.innerWidth}
                        ${window.innerHeight}
                    `}
                    preserveAspectRatio="none"
                >
                    <path
                        d={createPath()}
                        className="no-path-line"
                    />
                </svg>
            )}

            {/* =========================================
                MAIN CARD
            ========================================== */}

            <div className="card">

                {/* Decorative Lines */}

                <div className="card-lines card-lines-left">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="card-lines card-lines-right">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* =====================================
                    COFFEE
                ====================================== */}

                <div className="coffee-cup">
                    ☕
                </div>

                <div className="coffee-small-heart">
                    ♡
                </div>

                {/* =====================================
                    QUESTION
                ====================================== */}

                <h1>
                    Would you like to go for
                    <br />
                    a coffee with me?
                </h1>

                <p>
                    I promise it'll be a lovely time
                    <span> ❤️</span>
                </p>

                {/* =====================================
                    BUTTONS
                ====================================== */}

                <div className="buttons">

                    {/* YES */}

                    <button
                        className="yes-button"
                        onClick={() => {
                            setPage(2);
                        }}
                    >
                        Yes ❤️
                    </button>

                    {/* NO */}

                    <button
                        className={
                            noPosition
                                ? "no-button moved"
                                : "no-button"
                        }
                        style={
                            noPosition
                                ? {
                                      left: `${noPosition.x}px`,
                                      top: `${noPosition.y}px`
                                  }
                                : {}
                        }
                        onMouseEnter={
                            moveNoButton
                        }
                        onPointerEnter={
                            moveNoButton
                        }
                        onClick={
                            moveNoButton
                        }
                        onTouchStart={(event) => {
                            event.preventDefault();
                            moveNoButton();
                        }}
                    >
                        No 😜
                    </button>

                </div>

                {/* =====================================
                    BOTTOM HEARTS
                ====================================== */}

                <div className="card-bottom-heart left">
                    ♥
                </div>

                <div className="card-bottom-heart right">
                    ♥
                </div>

            </div>

            {/* =========================================
                CLOUDS
            ========================================== */}

            <div className="cloud cloud-left">
                <span></span>
                <span></span>
                <span></span>
            </div>

            <div className="cloud cloud-right">
                <span></span>
                <span></span>
                <span></span>
            </div>

        </div>
    );
}

export default App;