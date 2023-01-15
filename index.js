const apiKey = "83731f87d9b6bc5582bf6f8ad128f58f";
const apiUrl = "https://api.openweathermap.org/data/2.5/";
let dataArray = JSON.parse(localStorage.getItem('dataArray')) || [];

const weekDays = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
];

function formatDate(timestamp) {
    let date = new Date(timestamp);

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
    const cityElement = document.querySelector("#city");
    const dateElement = document.querySelector("#date");
    const descriptionElement = document.querySelector("#weather-description");
    const weatherIconElement = document.querySelector("#weather-icon");
    const tempElement = document.querySelector("#temp");
    const humidityElement = document.querySelector("#humidity");
    const windElement = document.querySelector("#wind");
    const iconElement = response.data.weather[0].icon;

    cityElement.innerHTML = response.data.name;
    dateElement.innerHTML = formatDate(response.data.dt * 1000);
    descriptionElement.innerHTML = response.data.weather[0].description;
    weatherIconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${iconElement}@2x.png`
    );
    weatherIconElement.setAttribute("alt", response.data.weather[0].description);
    celsiusCurrentTemp = Math.round(response.data.main.temp);
    tempElement.innerHTML = celsiusCurrentTemp;
    humidityElement.innerHTML = response.data.main.humidity;
    windElement.innerHTML = Math.round(response.data.wind.speed * 3.6);
}

function displayForecast(response) {
    const forecastElement = document.querySelector("#forecast");

    forecastElement.innerHTML = null;

    for (let index = 0; index < 6; index++) {
        const forecast = response.data.list[index];

        const maxTempForecast = Math.round(forecast.main.temp_max);
        const minTempForecast = Math.round(forecast.main.temp_min);
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


const searchedCity = document.querySelector("#submit-btn");
searchedCity.addEventListener("click", function (event) {
    event.preventDefault();

    const cityInput = document.querySelector("#searched-city");

    search(cityInput.value);

    cityInput.value = '';
});

const currentLocation = document.querySelector("#location-btn");
currentLocation.addEventListener("click", function (event) {
    event.preventDefault();

    navigator.geolocation.getCurrentPosition(function (position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        let baseUrl = `${apiUrl}weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        axios.get(baseUrl).then(displayRealTemp);

        baseUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`;

        axios.get(baseUrl).then(displayForecast);
    });
});

search("Kyiv");

function createElement(param) {
    const smallWeather = document.querySelector(".smallWeather");
    const miniBox = document.createElement("div");
    const updateInput = document.createElement("input");
    const updateBtn = document.createElement("button");
    const deleteBtn = document.createElement("span");

    miniBox.innerHTML += `<strong>${param.name}</strong><br>${Math.round(param.main.temp)}ºC`;
    updateBtn.innerHTML = 'Edit';
    deleteBtn.innerHTML = 'x';
    miniBox.classList.add('orange');
    deleteBtn.classList.add('deleteBtn');
    updateBtn.classList.add('editBtn');
    updateInput.classList.add('updateInput');

    smallWeather.appendChild(miniBox);
    miniBox.appendChild(deleteBtn);
    miniBox.appendChild(updateInput);
    miniBox.appendChild(updateBtn);
}


function deleteCard() {
    const arrDelBtn = document.querySelectorAll('.deleteBtn');
    const arrBoxBtn = document.querySelectorAll('.orange');
    const weath = document.querySelector('.smallWeather');

    for (let i = 0; i < arrDelBtn.length; i++) {
        arrDelBtn[i].onclick = () => {
            dataArray.splice(i, 1);

            localStorage.setItem('dataArray', JSON.stringify(dataArray));

            weath.removeChild(arrBoxBtn[i]);

            deleteCard();
        }
    }
}


function updateCard() {
    const arrDelBtn = document.querySelectorAll('.deleteBtn');
    const arrUpdateBtns = document.querySelectorAll('.editBtn');
    const arrInputValues = document.querySelectorAll('.updateInput');
    const arrBoxBtn = document.querySelectorAll('.orange');

    for (let i = 0; i < arrUpdateBtns.length; i++) {
        arrUpdateBtns[i].onclick = () => {
            let baseUrl = `${apiUrl}weather?q=${arrInputValues[i].value}&appid=${apiKey}&units=metric`;

            axios.get(baseUrl).then(function (response) {
                dataArray[i] = response.data;

                localStorage.setItem('dataArray', JSON.stringify(dataArray));

                arrBoxBtn[i].innerHTML = `<strong>${response.data.name}</strong><br>${Math.round(response.data.main.temp)}ºC`;

                arrBoxBtn[i].appendChild(arrInputValues[i]);
                arrBoxBtn[i].appendChild(arrUpdateBtns[i]);
                arrBoxBtn[i].appendChild(arrDelBtn[i]);

                arrInputValues[i].value = '';
            });
        }
    }
}

function drawCard(response) {
    const forecast = response.data;

    createElement(forecast);
    dataArray.push(forecast);

    localStorage.setItem('dataArray', JSON.stringify(dataArray));

    updateCard();

    deleteCard();
}

function searchForCard(city) {
    let baseUrl = `${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`;

    axios.get(baseUrl).then(drawCard);
}

const mainBtn = document.querySelector('.main-btn');
mainBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const mainInput = document.querySelector('.search-main')

    input = mainInput.value;

    searchForCard(mainInput.value);

    mainInput.value = '';
})

function drawCardAfterRefreshPage() {
    dataArray.forEach(function (el) {
        createElement(el);
        updateCard();
    });
    deleteCard();
}

drawCardAfterRefreshPage();


