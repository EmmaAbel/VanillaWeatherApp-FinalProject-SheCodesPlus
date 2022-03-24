function formatDate(timestamp) {
  let now = new Date();
  let days = [
    "Sunday",
    "Monday",
    "Tueday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let day = days[now.getDay()];
  let months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "Octobter",
    "November",
    "December",
  ];
  let month = months[now.getMonth()];
  let year = now.getFullYear();
  let date = now.getDate();
  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  return `Last updated ${day}, ${month} ${date} ${year} at ${hour}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;

  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 6) {
      forecastHTML =
        forecastHTML +
        `
   <div class="col-2">
      <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
       <span> ${getIcon(forecastDay.weather[0].icon)}
       <span/>
      <div class="weather-forecast-temperatures">
       <span class="weather-forecast-max-temperature">${Math.round(
         forecastDay.temp.max
       )}°</span
       >/<span class="weather-forecast-min-temperature grey">${Math.round(
         forecastDay.temp.min
       )}°</span>
      </div>
   </div>
  `;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function currentMaxMinTemp(response) {
  let minimumTemp = document.querySelector(".min-temperature");
  minimumTemp.innerHTML = Math.round(response.data.daily[0].temp.min);
  let maximumTemp = document.querySelector(".max-temperature");
  maximumTemp.innerHTML = Math.round(response.data.daily[0].temp.max);
}

function getForecast(coordinates) {
  let apiKey = "6cd400507dc4152e1e63d463507ab0e3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
  axios.get(apiUrl).then(currentMaxMinTemp);
}

function displayTemperature(response) {
  let cityElement = document.querySelector("#city");
  cityElement.innerHTML = response.data.name;

  celsiusTemperature = response.data.main.temp;
  let temperatureElement = document.querySelector("#temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  celsiusFeelsLike = response.data.main.feels_like;
  let feelsLikeElement = document.querySelector("#feelsLike");
  feelsLikeElement.innerHTML = Math.round(celsiusFeelsLike);

  let timeElement = document.querySelector("#time");
  timeElement.innerHTML = formatDate(response.data.dt * 1000);

  let iconElement = document.querySelector("#icon");
  iconElement.innerHTML = getIcon(response.data.weather[0].icon);

  nightDay(response.data.weather[0].icon);

  getForecast(response.data.coord);

  backgroundChange(response.data.weather[0].icon);
}

function getIcon(icon) {
  let newIconElement = "";
  if (icon === "02d") {
    newIconElement = `<i class="fa-solid fa-cloud-sun"></i>`;
  } else if (icon === "02n") {
    newIconElement = `<i class="fa-solid fa-cloud-moon"></i>`;
  } else if (icon === "03d") {
    newIconElement = `<i class="fa-solid fa-clouds-sun"></i>`;
  } else if (icon === "03n") {
    newIconElement = `<i class="fa-solid fa-clouds-moon"></i>`;
  } else if (icon === "04d" || icon === "04n") {
    newIconElement = `<i class="fa-solid fa-cloud"></i>`;
  } else if (icon === "01d") {
    newIconElement = `<i class="fa-solid fa-sun"></i>`;
  } else if (icon === "01n") {
    newIconElement = `<i class="fa-solid fa-moon"></i>`;
  } else if (icon === "10d") {
    newIconElement = `<i class="fa-solid fa-cloud-sun-rain"></i>`;
  } else if (icon === "10n") {
    newIconElement = `<i class="fa-solid fa-cloud-moon-rain"></i>`;
  } else if (icon === "09d" || icon === "09n") {
    newIconElement = `<i class="fa-solid fa-cloud-showers-heavy"></i>`;
  } else if (icon === "11d" || icon === "11n") {
    newIconElement = `<i class="fas fa-bolt"></i>`;
  } else if (icon === "13d" || icon === "13n") {
    newIconElement = `<i class="fa-solid fa-snowflake"></i>`;
  } else if (icon === "50d" || icon === "50n") {
    newIconElement = `<i class="fa-solid fa-smog"></i>`;
  }
  return newIconElement;
}

function nightDay(icon) {
  let nightTheme = document.body;
  let theme = "";
  if (
    icon === "01n" ||
    icon === "02n" ||
    icon === "03n" ||
    icon === "04n" ||
    icon === "09n" ||
    icon === "10n" ||
    icon === "11n" ||
    icon === "13n" ||
    icon === "50n"
  ) {
    nightTheme.classList.toggle("dark-mode");
  }
}

function search(city) {
  let apiKey = "6cd400507dc4152e1e63d463507ab0e3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function handleSubmit(event) {
  event.preventDefault();
  let cityInputElement = document.querySelector("#city-input");
  search(cityInputElement.value);
}

function handlePosition(position) {
  let longitude = position.coords.longitude;
  let latitude = position.coords.latitude;
  let apiKey = "6cd400507dc4152e1e63d463507ab0e3";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayTemperature);
}

function currentLocation(position) {
  navigator.geolocation.getCurrentPosition(handlePosition);
}

let form = document.querySelector("#search-form");
form.addEventListener("submit", handleSubmit);

let currentCity = document.querySelector("#currentCity");
currentCity.addEventListener("click", currentLocation);

search("Viborg");

function backgroundChange(icon) {
  let background = document.querySelector(".weatherApp");
  if (icon === "01d") {
    background.style.backgroundImage = `url("./images/01d.jpg")`;
  } else if (icon === "01n") {
    background.style.backgroundImage = `url("./images/01n.jpg")`;
  } else if (icon === "02d") {
    background.style.backgroundImage = `url("./images/02d.jpg")`;
  } else if (icon === "02n") {
    background.style.backgroundImage = `url("./images/02n.jpg")`;
  } else if (icon === "03d") {
    background.style.backgroundImage = `url("./images/03d.jpg")`;
  } else if (icon === "03n") {
    background.style.backgroundImage = `url("./images/03n.jpg")`;
  } else if (icon === "04d") {
    background.style.backgroundImage = `url("./images/04d.jpg")`;
  } else if (icon === "04n") {
    background.style.backgroundImage = `url("./images/04n.jpg")`;
  } else if (icon === "09d") {
    background.style.backgroundImage = `url("./images/09d.jpg")`;
  } else if (icon === "09n") {
    background.style.backgroundImage = `url("./images/09n.jpg")`;
  } else if (icon === "10d") {
    background.style.backgroundImage = `url("./images/10d.jpg")`;
  } else if (icon === "10n") {
    background.style.backgroundImage = `url("./images/10n.jpg")`;
  } else if (icon === "11d") {
    background.style.backgroundImage = `url("./images/11d.jpg")`;
  } else if (icon === "11n") {
    background.style.backgroundImage = `url("./images/11n.jpg")`;
  } else if (icon === "13d") {
    background.style.backgroundImage = `url("../images/13d.jpg")`;
  } else if (icon === "13n") {
    background.style.backgroundImage = `url("./images/13n.jpg")`;
  } else if (icon === "50d") {
    background.style.backgroundImage = `url("./images/50d.jpg")`;
  } else if (icon === "50n") {
    background.style.backgroundImage = `url("./images/50n.jpg")`;
  }
}
