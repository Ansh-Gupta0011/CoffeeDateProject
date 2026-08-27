import "./Confirmation.css";

function Confirmation({
    dateTime,
    selectedCafe
}) {
    return (
        <div className="confirmation-page">

            {/* Background decoration */}

            <div className="background-glow glow-one"></div>
            <div className="background-glow glow-two"></div>
            <div className="background-glow glow-three"></div>

            <div className="stars">
                <span className="big-star star-a">★</span>
                <span className="big-star star-b">★</span>
                <span className="big-star star-c">★</span>

                <span className="small-star star-d">✦</span>
                <span className="small-star star-e">✦</span>
                <span className="small-star star-f">✦</span>
                <span className="small-star star-g">✦</span>
                <span className="small-star star-h">✦</span>
            </div>

            <div className="sparkles">
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
            </div>

            <div className="floating-hearts">
                <span>♥</span>
                <span>♡</span>
                <span>♥</span>
                <span>♡</span>
                <span>♥</span>
                <span>♡</span>
            </div>

            {/* Main Card */}

            <div className="confirmation-card">

                {/* Decorative lines */}

                <div className="confirmation-lines confirmation-lines-left">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="confirmation-lines confirmation-lines-right">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* Coffee */}

                <div className="confirmation-coffee">
                    ☕
                </div>

                <div className="confirmation-heart">
                    ♥
                </div>

                {/* Heading */}

                <h1>
                    It's a Date! 💕
                </h1>

                <p className="confirmation-subtitle">
                    Our coffee date is officially planned!
                </p>

                {/* Date details */}

                <div className="date-details">

                    <div className="detail-item">
                        <div className="detail-icon">
                            📅
                        </div>

                        <div>
                            <span className="detail-label">
                                DATE
                            </span>

                            <strong>
                                {dateTime?.date || "Our special day"}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <div className="detail-icon">
                            🕐
                        </div>

                        <div>
                            <span className="detail-label">
                                TIME
                            </span>

                            <strong>
                                {dateTime?.time || "Our coffee time"}
                            </strong>
                        </div>
                    </div>

                    <div className="detail-item">
                        <div className="detail-icon">
                            ☕
                        </div>

                        <div>
                            <span className="detail-label">
                                PLACE
                            </span>

                            <strong>
                                {selectedCafe?.name ||
                                    "Our cute café"}
                            </strong>

                            {selectedCafe?.address && (
                                <small>
                                    {selectedCafe.address}
                                </small>
                            )}
                        </div>
                    </div>

                </div>

                {/* Message */}

                <div className="love-message">
                    <span>♡</span>

                    <p>
                        I can't wait to have
                        coffee with you!
                        <br />
                        It's going to be lovely ❤️
                    </p>

                    <span>♡</span>
                </div>

                {/* Footer */}

                <div className="confirmation-footer">
                    <p>
                        See you there! ☕💕
                    </p>
                </div>

                {/* Bottom hearts */}

                <div className="confirmation-bottom-heart left">
                    ♥
                </div>

                <div className="confirmation-bottom-heart right">
                    ♥
                </div>

            </div>

            {/* Clouds */}

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

export default Confirmation;