const apiKey = "83731f87d9b6bc5582bf6f8ad128f58f";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
let dataArray = [];
dataArray = JSON.parse(localStorage.getItem('dataArray') || '[]');

function formatDate(timestamp) {
    let date = new Date(timestamp);

    const weekDays = [
        "Sunday",
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
    ];
    let weekDay = weekDays[date.getDay()];

    return `${weekDay} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
    let date = new Date(timestamp);

    let hours = ("0" + date.getHours()).slice(-2);
    let minutes = ("0" + date.getMinutes()).slice(-2);

    return `${hours}:${minutes}`;
}

function displayRealTemp(response) {
    let cityElement = document.querySelector("#city");
    cityElement.innerHTML = response.data.name;

    let dateElement = document.querySelector("#date");
    dateElement.innerHTML = formatDate(response.data.dt * 1000);

    let descriptionElement = document.querySelector("#weather-description");
    descriptionElement.innerHTML = response.data.weather[0].description;

    let weatherIconElement = document.querySelector("#weather-icon");
    let iconElement = response.data.weather[0].icon;
    weatherIconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${iconElement}@2x.png`
    );
    weatherIconElement.setAttribute("alt", response.data.weather[0].description);

    let tempElement = document.querySelector("#temp");
    celsiusCurrentTemp = Math.round(response.data.main.temp);
    tempElement.innerHTML = celsiusCurrentTemp;

    let humidityElement = document.querySelector("#humidity");
    humidityElement.innerHTML = response.data.main.humidity;

    let windElement = document.querySelector("#wind");
    windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);

}

function displayForecast(response) {
    let forecastElement = document.querySelector("#forecast");
    forecastElement.innerHTML = null;

    for (let index = 0; index < 6; index++) {
        let forecast = response.data.list[index];

        let maxTempForecast = Math.round(forecast.main.temp_max);
        let minTempForecast = Math.round(forecast.main.temp_min);
        forecastElement.innerHTML += `
        <div class="col-2">
        <h6>
          ${formatHours(forecast.dt * 1000)}
        </h6>
        <img src="http://openweathermap.org/img/wn/${forecast.weather[0].icon
            }@2x.png" alt="${forecast.weather[0].description}" height="75" />
        <div>
          <strong><span class="max-temp">${maxTempForecast}</span></strong><span class="forecast-unit unit">ºC</span> <span class="min-temp">${minTempForecast}</span><span class="forecast-unit unit">ºC</span>
        </div>
        </div>
      `;
    }
}

function search(city) {
    let baseUrl = `${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(baseUrl).then(displayRealTemp);

    baseUrl = `${apiUrl}forecast?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(baseUrl).then(displayForecast);
}


let searchedCity = document.querySelector("#submit-btn");
searchedCity.addEventListener("click", function (event) {
    event.preventDefault();

    let cityInput = document.querySelector("#searched-city");

    search(cityInput.value);
});

let currentLocation = document.querySelector("#location-btn");
currentLocation.addEventListener("click", function (event) {
    event.preventDefault();

    navigator.geolocation.getCurrentPosition(function (position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        let baseUrl = `${apiUrl}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        axios.get(baseUrl).then(displayRealTemp);

        baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        axios.get(baseUrl).then(displayForecast);
    });
});

search("Kyiv");


function createCard(response) {
    let miniBox = document.createElement("div");
    const smallWeather = document.querySelector(".smallWeather");
    let array = [];
    miniBox.classList.add('orange');
    smallWeather.appendChild(miniBox);
    array.push(response.data);
    localStorage.setItem('array', JSON.stringify(array));
    let result = JSON.parse(localStorage.getItem('array'));
    miniBox.innerHTML += `City:<strong>${result[0].name}</strong><br>${Math.round(result[0].main.temp)}ºC`;
    dataArray.push(result[0]);
    localStorage.setItem('dataArray', JSON.stringify(dataArray));
    let updateInput = document.createElement('input');
    miniBox.appendChild(updateInput);
    let updateBtn = document.createElement('button');
    updateBtn.innerHTML = 'GO';
    miniBox.appendChild(updateBtn);
}


function searchForCard(city) {
    let baseUrl = `${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`;
    axios.get(baseUrl).then(createCard);
}


let mainBtn = document.querySelector('.main-btn');
mainBtn.addEventListener("click", function (event) {
    event.preventDefault();
    let mainInput = document.querySelector('.search-main')
    searchForCard(mainInput.value);
})


window.onload = function (e) {
    if (localStorage.getItem('dataArray').includes('')) {
        let dataArr = JSON.parse(localStorage.getItem('dataArray'));
        dataArr.forEach(el => {
            const miniBox = document.createElement("div");
            miniBox.classList.add('orange');
            const smallWeather = document.querySelector(".smallWeather");
            smallWeather.appendChild(miniBox);
            miniBox.innerHTML = `City:<strong>${el.name}</strong><br>${Math.round(el.main.temp)}ºC`;
            let updateInput = document.createElement('input');
            miniBox.appendChild(updateInput);
            let updateBtn = document.createElement('button');
            updateBtn.innerHTML = 'GO';
            miniBox.appendChild(updateBtn);
            // updateBtn.onclick = () => {
            //     // console.log(el);
            //     let baseUrl = `${apiUrl}weather?q=${updateInput.value}&appid=${apiKey}&units=metric`;
            //     axios.get(baseUrl).then(function (response) {
            //         let a = response.data;
            //         el = a;
            //         console.log(el);
            // TODO: ЗАМЕНИТЬ ЕЛЕМЕНТ В ЛОКАЛСТ
            //TODO: УБРАТЬ ПОВТОРЯЮЩИЕСЯ ЕЛЕМЕНТЫ В МАССИВЕ
            //     });
            // }
        });
    }

}
