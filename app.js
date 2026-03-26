// 🌦 WeatherApp Constructor
function WeatherApp(apiKey) {
    this.apiKey = apiKey;
    this.apiUrl = "https://api.openweathermap.org/data/2.5/weather";
    this.forecastUrl = "https://api.openweathermap.org/data/2.5/forecast";

    // 🎯 DOM ELEMENTS
    this.searchBtn = document.getElementById("search-btn");
    this.cityInput = document.getElementById("city-input");
    this.weatherDisplay = document.getElementById("weather-display");

    this.init();
}

// 🚀 INIT METHOD
WeatherApp.prototype.init = function () {
    // Button click
    this.searchBtn.addEventListener("click", this.handleSearch.bind(this));

    // Enter key
    this.cityInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            this.handleSearch();
        }
    });

    // Welcome message (same as before)
    this.showWelcome();
};

// 🌍 WELCOME (unchanged logic, just moved)
WeatherApp.prototype.showWelcome = function () {
    this.weatherDisplay.innerHTML = `
        <div class="welcome-message">
            <h3>🌍 Welcome to SkyFetch</h3>
            <p>Search any city in the world to get weather updates</p>
        </div>
    `;
};

// 🔍 HANDLE SEARCH (same logic, now method)
WeatherApp.prototype.handleSearch = function () {
    const city = this.cityInput.value.trim();

    // VALIDATION (same as your code)
    if (!city) {
        this.showError("Please enter a city name.");
        return;
    }

    if (city.length < 2) {
        this.showError("City name must be at least 2 characters.");
        return;
    }

    // ✨ Flash animation (kept)
    document.body.classList.add("flash");
    setTimeout(() => {
        document.body.classList.remove("flash");
    }, 300);

    this.getWeather(city);

    this.cityInput.value = "";
};

// 🌍 MAIN WEATHER FUNCTION (UPGRADED)
WeatherApp.prototype.getWeather = async function (city) {
    this.showLoading();

    this.searchBtn.disabled = true;
    this.searchBtn.textContent = "Searching...";

    const currentUrl = `${this.apiUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;

    try {
        // 🔥 Promise.all (NEW)
        const [currentRes, forecastRes] = await Promise.all([
            axios.get(currentUrl),
            this.getForecast(city)
        ]);

        console.log("API DATA:", currentRes.data);

        this.displayWeather(currentRes.data);
        this.displayForecast(forecastRes);

    } catch (error) {
        console.error("Error:", error);

        if (error.response && error.response.status === 404) {
            this.showError("City not found. Please check spelling.");
        } else {
            this.showError("Network issue. Try again.");
        }

    } finally {
        this.searchBtn.disabled = false;
        this.searchBtn.textContent = "🔍 Search";
    }
};

// 📊 GET FORECAST (NEW)
WeatherApp.prototype.getForecast = async function (city) {
    const url = `${this.forecastUrl}?q=${encodeURIComponent(city)}&appid=${this.apiKey}&units=metric`;

    const response = await axios.get(url);
    return response.data;
};

// 🧠 PROCESS FORECAST (NEW)
WeatherApp.prototype.processForecastData = function (data) {
    const daily = data.list.filter(item =>
        item.dt_txt.includes("12:00:00")
    );

    return daily.slice(0, 5);
};

// 🌤 DISPLAY WEATHER (same as before)
WeatherApp.prototype.displayWeather = function (data) {
    const iconUrl = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

    this.weatherDisplay.innerHTML = `
        <div class="weather-info">
            <h2 class="city-name">${data.name}, ${data.sys.country}</h2>
            <img src="${iconUrl}" class="weather-icon" />
            <div class="temperature">${Math.round(data.main.temp)}°C</div>
            <p class="description">${data.weather[0].description}</p>
        </div>
    `;

    this.cityInput.focus();
};

// 📅 DISPLAY FORECAST (NEW)
WeatherApp.prototype.displayForecast = function (data) {
    const daily = this.processForecastData(data);

    const forecastHTML = daily.map(day => {
        const date = new Date(day.dt * 1000);
        const dayName = date.toLocaleDateString("en-US", { weekday: "short" });

        return `
            <div class="forecast-card">
                <h4>${dayName}</h4>
                <img src="https://openweathermap.org/img/wn/${day.weather[0].icon}.png"/>
                <p class="forecast-temp">${Math.round(day.main.temp)}°C</p>
                <p class="forecast-desc">${day.weather[0].description}</p>
            </div>
        `;
    }).join("");

    const section = `
        <div class="forecast-section">
            <h3>5-Day Forecast</h3>
            <div class="forecast-container">
                ${forecastHTML}
            </div>
        </div>
    `;

    // IMPORTANT: append, not replace
    this.weatherDisplay.innerHTML += section;
};

// 🔄 LOADING (same)
WeatherApp.prototype.showLoading = function () {
    this.weatherDisplay.innerHTML = `
        <div class="loading-container">
            <div class="spinner"></div>
            <p>Fetching weather...</p>
        </div>
    `;
};

// ❌ ERROR (same)
WeatherApp.prototype.showError = function (message) {
    this.weatherDisplay.innerHTML = `
        <div class="error-message">
            <h3>⚠️ Error</h3>
            <p>${message}</p>
        </div>
    `;
};

// 🔥 CREATE INSTANCE (REPLACES OLD CODE)
const app = new WeatherApp("7023b57ec1c779aac4581074f6d60017");