import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

import "./CafeMap.css";

function CafeMap({ onCafeSelect, dateTime }) {
    const mapRef = useRef(null);

    const [cafes, setCafes] = useState([]);
    const [selectedCafe, setSelectedCafe] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    // User information
    const [userIp, setUserIp] = useState("");
    const [userLocation, setUserLocation] = useState(null);

    // =====================================================
    // GET PUBLIC IP
    // =====================================================

    async function getUserIp() {
        try {
            const response = await fetch(
                "https://api.ipify.org?format=json"
            );

            if (!response.ok) {
                throw new Error("Unable to fetch IP");
            }

            const data = await response.json();

            console.log("User Public IP:", data.ip);

            setUserIp(data.ip);

            return data.ip;
        } catch (err) {
            console.error("IP Error:", err);

            setUserIp("Unable to detect");

            return null;
        }
    }

    // =====================================================
    // INITIALIZE MAP
    // =====================================================

    useEffect(() => {
        let cancelled = false;

        async function initializeMap() {
            try {
                const apiKey =
                    import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

                const mapId =
                    import.meta.env.VITE_GOOGLE_MAPS_MAP_ID;

                // Check API key
                if (!apiKey) {
                    throw new Error(
                        "Google Maps API key is missing."
                    );
                }

                // Get public IP
                getUserIp();

                // Google Maps options
                setOptions({
                    key: apiKey,
                    v: "weekly"
                });

                // Load Google Maps
                const [{ Map }] = await Promise.all([
                    importLibrary("maps")
                ]);

                // Check geolocation
                if (!navigator.geolocation) {
                    throw new Error(
                        "Your browser does not support location."
                    );
                }

                // Get current location
                navigator.geolocation.getCurrentPosition(
                    async (position) => {
                        if (cancelled) {
                            return;
                        }

                        const location = {
                            lat: position.coords.latitude,
                            lng: position.coords.longitude
                        };

                        console.log(
                            "Current Location:",
                            location
                        );

                        setUserLocation(location);

                        // Map options
                        const mapOptions = {
                            center: location,
                            zoom: 14,
                            mapTypeControl: false,
                            streetViewControl: false,
                            fullscreenControl: false
                        };

                        // Add Map ID for Advanced Markers
                        if (mapId) {
                            mapOptions.mapId = mapId;
                        }

                        const map = new Map(
                            mapRef.current,
                            mapOptions
                        );

                        // Find nearby cafés
                        await findNearbyCafes(
                            map,
                            location
                        );
                    },
                    (geoError) => {
                        console.error(
                            "Geolocation Error:",
                            geoError
                        );

                        setError(
                            "Please allow location access to find nearby cafés."
                        );

                        setLoading(false);
                    },
                    {
                        enableHighAccuracy: true,
                        timeout: 10000,
                        maximumAge: 0
                    }
                );
            } catch (err) {
                console.error(
                    "Google Maps initialization error:",
                    err
                );

                setError(
                    err.message ||
                    "Unable to load Google Maps."
                );

                setLoading(false);
            }
        }

        initializeMap();

        return () => {
            cancelled = true;
        };
    }, []);

    // =====================================================
    // FIND NEARBY CAFES
    // =====================================================

    async function findNearbyCafes(map, location) {
        try {
            const [
                { Place, SearchNearbyRankPreference },
                { AdvancedMarkerElement }
            ] = await Promise.all([
                importLibrary("places"),
                importLibrary("marker")
            ]);

            const request = {
                fields: [
                    "displayName",
                    "location",
                    "formattedAddress",
                    "rating",
                    "userRatingCount",
                    "googleMapsURI"
                ],

                locationRestriction: {
                    center: location,
                    radius: 5000
                },

                includedPrimaryTypes: ["cafe"],

                maxResultCount: 8,

                rankPreference:
                    SearchNearbyRankPreference.DISTANCE
            };

            const { places } =
                await Place.searchNearby(request);

            if (!places || places.length === 0) {
                setError(
                    "No cafés found nearby."
                );

                setLoading(false);

                return;
            }

            // =================================================
            // FORMAT CAFE DATA
            // =================================================

            const cafeData = places.map((place, index) => ({
                id: index,

                // Google Places API returns displayName as a string
                name:
                    place.displayName ||
                    "Unnamed Café",

                address:
                    place.formattedAddress ||
                    "Address unavailable",

                rating:
                    place.rating || null,

                ratingCount:
                    place.userRatingCount || 0,

                location:
                    place.location,

                mapsUrl:
                    place.googleMapsURI || ""
            }));

            setCafes(cafeData);

            // =================================================
            // CREATE MAP MARKERS
            // =================================================

            places.forEach((place, index) => {
                if (!place.location) {
                    return;
                }

                const marker = new AdvancedMarkerElement({
                    map,
                    position: place.location,
                    title:
                        place.displayName ||
                        "Unnamed Café"
                });

                marker.addListener(
                    "click",
                    () => {
                        selectCafe(
                            cafeData[index]
                        );
                    }
                );
            });

            setLoading(false);
        } catch (err) {
            console.error(
                "Nearby cafe error:",
                err
            );

            setError(
                "Unable to find nearby cafés."
            );

            setLoading(false);
        }
    }

    // =====================================================
    // SELECT CAFE
    // =====================================================

    function selectCafe(cafe) {
        setSelectedCafe(cafe);

        console.log(
            "Selected Cafe:",
            cafe
        );
    }

    // =====================================================
    // CONTINUE
    // =====================================================

    async function handleContinue() {
        if (!selectedCafe) {
            return;
        }

        const coffeeDateData = {
            date: dateTime?.date || "",
            time: dateTime?.time || "",

            cafe: {
                id: selectedCafe.id,
                name: selectedCafe.name,
                address: selectedCafe.address,
                rating: selectedCafe.rating,
                ratingCount: selectedCafe.ratingCount,
                mapsUrl: selectedCafe.mapsUrl
            },

            userIp: userIp || "",

            userLocation: userLocation
                ? {
                    lat: userLocation.lat,
                    lng: userLocation.lng
                }
                : null
        };

        console.log(
            "========== SENDING COFFEE DATE =========="
        );

        console.log(
            JSON.stringify(
                coffeeDateData,
                null,
                2
            )
        );

        try {
            setLoading(true);

            const response = await fetch(
                "https://coffeedateproject-1.onrender.com/api/coffee-date",
                {
                    method: "POST",

                    headers: {
                        "Content-Type": "application/json"
                    },

                    body: JSON.stringify(
                        coffeeDateData
                    )
                }
            );

            const result = await response.json();

            console.log(
                "Backend response:",
                result
            );

            // Handle failed API response
            if (!response.ok || !result.success) {
                throw new Error(
                    result.message ||
                    "Failed to save coffee date"
                );
            }

            console.log(
                "Coffee date saved successfully ❤️"
            );

            /*
             * IMPORTANT:
             *
             * Do NOT show alert here.
             *
             * App.jsx will receive this callback
             * and move to Screen 4.
             */

            if (onCafeSelect) {
                onCafeSelect(
                    selectedCafe
                );
            }

        } catch (error) {
            console.error(
                "Coffee date save error:",
                error
            );

            setError(
                "Unable to save your coffee date. Please try again."
            );

        } finally {
            setLoading(false);
        }
    }

    // =====================================================
    // UI
    // =====================================================

    return (
        <div className="cafe-page">

            {/* =========================================
                BACKGROUND
            ========================================= */}

            <div className="background-glow glow-one"></div>
            <div className="background-glow glow-two"></div>
            <div className="background-glow glow-three"></div>

            {/* Stars */}

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

            {/* Sparkles */}

            <div className="sparkles">
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
                <span>✦</span>
                <span>✧</span>
            </div>

            {/* Hearts */}

            <div className="floating-hearts">
                <span>♥</span>
                <span>♡</span>
                <span>♥</span>
                <span>♡</span>
                <span>♥</span>
                <span>♡</span>
            </div>

            {/* =========================================
                MAIN CARD
            ========================================= */}

            <div className="cafe-screen-card">

                {/* Decorative Lines */}

                <div className="cafe-card-lines cafe-card-lines-left">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                <div className="cafe-card-lines cafe-card-lines-right">
                    <span></span>
                    <span></span>
                    <span></span>
                </div>

                {/* HEADER */}

                <div className="cafe-header">

                    <div className="cafe-header-icon">
                        ☕
                    </div>

                    <div className="cafe-header-heart">
                        ♡
                    </div>

                    <h1>
                        Where should we go
                        <br />
                        for our coffee?
                    </h1>

                    <p>
                        Pick a cute place for us ❤️
                    </p>

                </div>

                {/* USER LOCATION INFO */}

                <div className="user-location-info">

                    {userLocation && (
                        <span>
                            📍 Location detected
                        </span>
                    )}

                    {userIp && (
                        <span>
                            🌐 IP: {userIp}
                        </span>
                    )}

                </div>

                {/* MAP + CAFE LIST */}

                <div className="cafe-map-container">

                    {/* MAP */}

                    <div
                        ref={mapRef}
                        className="google-map"
                    />

                    {/* CAFE LIST */}

                    <div className="cafe-list">

                        {/* LOADING */}

                        {loading && (
                            <div className="cafe-loading">

                                <div className="loading-heart">
                                    ♥
                                </div>

                                <p>
                                    Finding cute coffee
                                    places nearby... ☕
                                </p>

                            </div>
                        )}

                        {/* ERROR */}

                        {error && (
                            <div className="cafe-error">

                                <span>
                                    💕
                                </span>

                                <p>
                                    {error}
                                </p>

                            </div>
                        )}

                        {/* CAFES */}

                        {!loading &&
                            !error &&
                            cafes.map((cafe) => (

                                <div
                                    key={cafe.id}
                                    className={
                                        `real-cafe-card ${
                                            selectedCafe?.id === cafe.id
                                                ? "selected"
                                                : ""
                                        }`
                                    }
                                    onClick={() =>
                                        selectCafe(cafe)
                                    }
                                >

                                    <div className="real-cafe-icon">
                                        ☕
                                    </div>

                                    <div className="real-cafe-info">

                                        <h3>
                                            {cafe.name}
                                        </h3>

                                        <p>
                                            {cafe.address}
                                        </p>

                                        {cafe.rating && (
                                            <div className="cafe-rating">

                                                ⭐ {cafe.rating}

                                                {cafe.ratingCount > 0 && (
                                                    <span>
                                                        {" "}
                                                        ({cafe.ratingCount})
                                                    </span>
                                                )}

                                            </div>
                                        )}

                                    </div>

                                    <div className="cafe-check">

                                        {selectedCafe?.id === cafe.id
                                            ? "✓"
                                            : "♡"}

                                    </div>

                                </div>

                            ))}

                    </div>

                </div>

                {/* FOOTER */}

                <div className="cafe-footer">

                    <p>
                        {selectedCafe
                            ? `Perfect choice! ${selectedCafe.name} 💕`
                            : "Choose a café for our date 😊"}
                    </p>

                    <button
                        className="cafe-continue-button"
                        disabled={!selectedCafe || loading}
                        onClick={handleContinue}
                    >
                        {loading
                            ? "Saving... ❤️"
                            : "Continue 💗"}
                    </button>

                </div>

                {/* Bottom Hearts */}

                <div className="cafe-bottom-heart left">
                    ♥
                </div>

                <div className="cafe-bottom-heart right">
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

export default CafeMap;
