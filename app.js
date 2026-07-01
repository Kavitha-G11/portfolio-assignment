document.getElementById('search-btn').addEventListener('click', handleSearch);
document.getElementById('city-input').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') handleSearch();
});

async function handleSearch() {
    const city = document.getElementById('city-input').value.trim();
    if (!city) return;

    const errorBox = document.getElementById('error-message');
    const displayBox = document.getElementById('weather-display');

    // Hide previous states
    errorBox.classList.add('hidden');
    displayBox.classList.add('hidden');

    try {
        // Step 1: Fetch coordinates for the city name using Geocoding API
        const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`;
        const geoResponse = await fetch(geoUrl);
        
        if (!geoResponse.ok) throw new Error("Network response failed while locating city.");
        
        const geoData = await geoResponse.json();
        
        // Error handling if city name is invalid or not found
        if (!geoData.results || geoData.results.length === 0) {
            throw new Error("City not found. Please check spelling.");
        }

        const { latitude, longitude, name, country } = geoData.results[0];

        // Step 2: Fetch real-time weather using coordinates
        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,wind_speed_10m,weather_code&wind_speed_unit=kmh`;
        const weatherResponse = await fetch(weatherUrl);
        
        if (!weatherResponse.ok) throw new Error("Failed to fetch weather data.");
        
        const weatherData = await weatherResponse.json();

        // Step 3: Parse weather description code
        const weatherDesc = parseWeatherCode(weatherData.current.weather_code);

        // Step 4: Render values dynamically to the DOM
        document.getElementById('city-name').textContent = `${name}, ${country}`;
        document.getElementById('temp-val').textContent = `${Math.round(weatherData.current.temperature_2m)}°C`;
        document.getElementById('condition-val').textContent = weatherDesc;
        document.getElementById('humidity-val').textContent = `${weatherData.current.relative_humidity_2m}%`;
        document.getElementById('wind-val').textContent = `${weatherData.current.wind_speed_10m} km/h`;

        // Reveal layout box
        displayBox.classList.remove('hidden');

    } catch (error) {
        // Handle and display all comprehensive fetch errors cleanly
        errorBox.textContent = error.message;
        errorBox.classList.remove('hidden');
    }
}

// Simple helper function to parse dynamic weather codes
function parseWeatherCode(code) {
    if (code === 0) return "Clear Sky";
    if (code >= 1 && code <= 3) return "Partly Cloudy";
    if (code >= 45 && code <= 48) return "Foggy";
    if (code >= 51 && code <= 67) return "Rainy";
    if (code >= 71 && code <= 77) return "Snowy";
    if (code >= 80 && code <= 82) return "Heavy Showers";
    if (code >= 95 && code <= 99) return "Thunderstorm";
    return "Variable Conditions";
}