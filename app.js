
const btn = document.getElementById("btn");
const input = document.getElementById("Input");
const API_KEY = "4fc3fd47a1353f0337cf8f849b0b6385";

const loading = document.getElementById("loading");
const weatherBox = document.getElementById("weatherBox");

// Live Date & Time
function updateDateTime() {
  const now = new Date();

  const dateOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric"
  };

  document.getElementById("date").textContent = now.toLocaleDateString(
    "en-US",
    dateOptions
  );

  document.getElementById("time").textContent = now.toLocaleTimeString();
}

setInterval(updateDateTime, 1000);
updateDateTime();

// Loading State
function showLoading(state) {
  loading.style.display = state ? "block" : "none";
}

// Search by City
async function fetchData(city) {
  showLoading(true);

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    if (data.cod !== 200) {
      alert("City not found! Please enter a valid city.");
      showLoading(false);
      return;
    }

    displayWeather(data);
  } catch (err) {
    console.error(err);
    alert("Something went wrong while fetching weather data.");
  }

  showLoading(false);
}

// Search by Coordinates
async function fetchDataByCoordinates(lat, lon) {
  showLoading(true);

  try {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
    );

    const data = await res.json();

    if (data.cod !== 200) {
      alert("Unable to fetch your location weather.");
      showLoading(false);
      return;
    }

    displayWeather(data);
  } catch (err) {
    console.error(err);
    alert("Location access failed!");
  }

  showLoading(false);
}

// Button Click Events
btn.addEventListener("click", () => {
  const city = input.value.trim();

  if (city) {
    fetchData(city);
  } else {
    alert("Please enter a city name!");
  }
});

// Press Enter Key
input.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const city = input.value.trim();

    if (city) {
      fetchData(city);
    } else {
      alert("Please enter a city name!");
    }
  }
});

// Current Location
document.getElementById("locationBtn").addEventListener("click", () => {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        fetchDataByCoordinates(
          position.coords.latitude,
          position.coords.longitude
        );
      },
      () => {
        alert("Unable to access your location.");
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
});

// Display Weather Data
function displayWeather(data) {
  const { main, name, weather, wind, sys } = data;

  // Temperature
  document.getElementById("Temp").textContent =
    `${Math.round(main.temp)}°C`;

  // City
  document.getElementById("City").textContent = name;

  // Weather Description
  document.getElementById("cldd").textContent =
    weather[0].description;

  // Feels Like
  document.getElementById("feelsLike").textContent =
    `Feels like ${Math.round(main.feels_like)}°C`;

  // Weather Icon
  document.getElementById(
    "weatherIcon"
  ).src = `https://openweathermap.org/img/wn/${weather[0].icon}@4x.png`;

  // Wind
  document.getElementById("wind").textContent =
    `${wind.speed} km/h`;

  // Humidity
  document.getElementById("humidity").textContent =
    `${main.humidity}%`;

  // Pressure
  document.getElementById("pressure").textContent =
    `${main.pressure} hPa`;

  // Sunrise
  document.getElementById("sunrise").textContent =
    new Date(sys.sunrise * 1000).toLocaleTimeString();

  // Sunset
  document.getElementById("sunset").textContent =
    new Date(sys.sunset * 1000).toLocaleTimeString();

  // Show Weather Box
  weatherBox.style.display = "block";

  // Change Theme Based on Weather
  setTheme(weather[0].main.toLowerCase());
}

// Dynamic Real Weather Backgrounds
function setTheme(condition) {
  const body = document.body;
  const appContainer = document.querySelector(".app-container");

  let backgroundImage = "";
  let overlay = "";

  // Clear Sky
  if (condition.includes("clear")) {
    backgroundImage =
      "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1600&q=80')";
    overlay =
      "linear-gradient(rgba(255,200,87,0.25), rgba(0,0,0,0.35))";
  }

  // Cloudy
  else if (condition.includes("cloud")) {
    backgroundImage =
      "url('https://media.giphy.com/media/xT0xeJpnrWC4XWblEk/giphy.gif')";
    overlay =
      "linear-gradient(rgba(120,120,120,0.35), rgba(0,0,0,0.45))";
  }

  // Rain / Drizzle
  else if (
    condition.includes("rain") ||
    condition.includes("drizzle")
  ) {
    backgroundImage =
      "url('https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif')";
    overlay =
      "linear-gradient(rgba(50,50,90,0.45), rgba(0,0,0,0.6))";
  }

  // Thunderstorm
  else if (condition.includes("thunderstorm")) {
    backgroundImage =
      "url('https://media.giphy.com/media/l0HlPwMAzh13pcZ20/giphy.gif')";
    overlay =
      "linear-gradient(rgba(20,20,40,0.55), rgba(0,0,0,0.75))";
  }

  // Snow
  else if (condition.includes("snow")) {
    backgroundImage =
      "url('https://media.giphy.com/media/26BRv0ThflsHCqDrG/giphy.gif')";
    overlay =
      "linear-gradient(rgba(255,255,255,0.2), rgba(0,0,0,0.35))";
  }

  // Mist / Fog / Haze
  else if (
    condition.includes("mist") ||
    condition.includes("fog") ||
    condition.includes("haze")
  ) {
    backgroundImage =
      "url('https://images.unsplash.com/photo-1487621167305-5d248087c724?auto=format&fit=crop&w=1600&q=80')";
    overlay =
      "linear-gradient(rgba(180,180,180,0.35), rgba(0,0,0,0.45))";
  }

  // Default
  else {
    backgroundImage =
      "url('https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1600&q=80')";
    overlay =
      "linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.45))";
  }

  // Apply Background
  body.style.backgroundImage = `${overlay}, ${backgroundImage}`;
  body.style.backgroundSize = "cover";
  body.style.backgroundPosition = "center";
  body.style.backgroundRepeat = "no-repeat";
  body.style.backgroundAttachment = "fixed";
  body.style.transition = "all 1s ease-in-out";

  // Glassmorphism Card Effect
  appContainer.style.background = "rgba(255, 255, 255, 0.18)";
  appContainer.style.backdropFilter = "blur(18px)";
  appContainer.style.webkitBackdropFilter = "blur(18px)";
  appContainer.style.border =
    "1px solid rgba(255,255,255,0.25)";
  appContainer.style.boxShadow =
    "0 8px 32px rgba(0,0,0,0.35)";
}
