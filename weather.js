
const form = document.querySelector("#search-form");
const cityInput = document.querySelector("#city-input");
const searchButton = document.querySelector("#search-button");
const statusMessage = document.querySelector("#status");
const weatherPanel = document.querySelector("#weather-panel");

const weatherCodes = {
    0: ["Clear sky", "☀️"],
    1: ["Mainly clear", "🌤️"],
    2: ["Partly cloudy", "⛅"],
    3: ["Overcast", "☁️"],
    45: ["Foggy", "🌫️"],
    48: ["Depositing rime fog", "🌫️"],
    51: ["Light drizzle", "🌦️"],
    53: ["Moderate drizzle", "🌦️"],
    55: ["Dense drizzle", "🌧️"],
    61: ["Light rain", "🌦️"],
    63: ["Moderate rain", "🌧️"],
    65: ["Heavy rain", "🌧️"],
    71: ["Light snowfall", "🌨️"],
    73: ["Moderate snowfall", "🌨️"],
    75: ["Heavy snowfall", "❄️"],
    80: ["Rain showers", "🌦️"],
    81: ["Moderate rain showers", "🌧️"],
    82: ["Heavy rain showers", "⛈️"],
    95: ["Thunderstorm", "⛈️"],
    96: ["Thunderstorm with hail", "⛈️"],
    99: ["Thunderstorm with heavy hail", "⛈️"]
};

async function fetchJSON(url) {
    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Request failed (HTTP ${response.status}).`);
    }

    return response.json();
}

async function searchWeather(city) {
    const geocodingURL =
        "https://geocoding-api.open-meteo.com/v1/search?" +
        new URLSearchParams({
            name: city,
            count: "1",
            language: "en",
            format: "json"
        });

    const locationData = await fetchJSON(geocodingURL);
    const location = locationData.results?.[0];

    if (!location) {
        throw new Error("City not found. Check the spelling and try again.");
    }

    const weatherURL =
        "https://api.open-meteo.com/v1/forecast?" +
        new URLSearchParams({
            latitude: location.latitude,
            longitude: location.longitude,
            current: [
                "temperature_2m",
                "relative_humidity_2m",
                "apparent_temperature",
                "is_day",
                "precipitation",
                "weather_code",
                "wind_speed_10m"
            ].join(","),
            timezone: "auto"
        });

    const weatherData = await fetchJSON(weatherURL);

    if (!weatherData.current) {
        throw new Error("Weather data is unavailable for this city.");
    }

    displayWeather(location, weatherData);
}

function displayWeather(location, data) {
    const current = data.current;
    const code = current.weather_code;
    const description = weatherCodes[code] || ["Unknown conditions", "🌡️"];

    document.querySelector("#city-name").textContent =
        `${location.name}, ${location.country || location.country_code || ""}`;

    document.querySelector("#weather-description").textContent =
        description[0];

    document.querySelector("#weather-icon").textContent =
        current.is_day ? description[1] : "🌙";

    document.querySelector("#temperature").textContent =
        Math.round(current.temperature_2m);

    document.querySelector("#feels-like").textContent =
        `Feels like ${Math.round(current.apparent_temperature)}°C`;

    document.querySelector("#humidity").textContent =
        current.relative_humidity_2m;

    document.querySelector("#wind-speed").textContent =
        current.wind_speed_10m;

    document.querySelector("#precipitation").textContent =
        current.precipitation;

    document.querySelector("#local-time").textContent =
        `Local time: ${current.time.replace("T", " ")}`;

    weatherPanel.hidden = false;
}

form.addEventListener("submit", async event => {
    event.preventDefault();

    const city = cityInput.value.trim();

    if (!city) {
        statusMessage.textContent = "Please enter a city name.";
        return;
    }

    searchButton.disabled = true;
    searchButton.textContent = "Searching...";
    statusMessage.textContent = "Fetching the latest weather data...";
    weatherPanel.hidden = true;

    try {
        await searchWeather(city);
        statusMessage.textContent = "Weather loaded successfully.";
    } catch (error) {
        statusMessage.textContent =
            error instanceof TypeError
                ? "Network error. Check your internet connection and try again."
                : error.message || "Something went wrong. Please try again.";
    } finally {
        searchButton.disabled = false;
        searchButton.textContent = "Search";
    }
});
