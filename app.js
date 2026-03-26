// 🔑 API CONFIG
const API_KEY = "7023b57ec1c779aac4581074f6d60017";
const API_URL = "https://api.openweathermap.org/data/2.5/weather";

// 🎯 DOM ELEMENTS
const searchBtn = document.getElementById("search-btn");
const cityInput = document.getElementById("city-input");
const weatherDisplay = document.getElementById("weather-display");

// 🌟 INITIAL WELCOME MESSAGE
weatherDisplay.innerHTML = `
    <div class="welcome-message">
        <h3>🌍 Welcome to SkyFetch</h3>
        <p>Search any city in the world to get weather updates</p>
    </div>
`;

// 🔄 SHOW LOADING
function showLoading() {
    weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather...</p>
        </div>
    `;
}

// ❌ SHOW ERROR
function showError(message) {
    weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
}

// 🌤 DISPLAY WEATHER
function displayWeather(data) {
    const city = data.name;
    const country = data.sys.country;
    const temp = Math.round(data.main.temp);
    const desc = data.weather[0].description;
    const icon = data.weather[0].icon;

    const iconUrl = `https://openweathermap.org/img/wn/${icon}@2x.png`;

    weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${city}, ${country}</h2>
            <img src="${iconUrl}" class="weather-icon" />
            <div class="temperature">${temp}°C</div>
            <p class="description">${desc}</p>
        </div>
    `;

    // 🎯 Focus back to input for better UX
    cityInput.focus();
}

// 🌍 FETCH WEATHER (ASYNC/AWAIT)
async function getWeather(city) {
    showLoading();

    const url = `${API_URL}?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`;

    // 🔒 Disable button during fetch
    searchBtn.disabled = true;
    searchBtn.textContent = "Searching...";

    try {
        const response = await axios.get(url);

        console.log("API DATA:", response.data);

        displayWeather(response.data);

    } catch (error) {
        console.error("Error:", error);

        if (error.response && error.response.status === 404) {
            showError("City not found. Please check spelling.");
        } else {
            showError("Network issue. Try again.");
        }

    } finally {
        // 🔓 Re-enable button
        searchBtn.disabled = false;
        searchBtn.textContent = "🔍 Search";
    }
}

// 🔍 SEARCH BUTTON CLICK
searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    // 🧠 VALIDATION
    if (!city) {
        showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        showError("City name must be at least 2 characters.");
        return;
    }

    // ✨ FLASH ANIMATION
    document.body.classList.add("flash");
    setTimeout(() => {
        document.body.classList.remove("flash");
    }, 300);

    getWeather(city);

    // 🧹 Clear input
    cityInput.value = "";
});

// ⌨️ ENTER KEY SUPPORT
cityInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        searchBtn.click();
    }
});