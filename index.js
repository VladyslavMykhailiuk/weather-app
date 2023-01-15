import axiosInstance from "./instance.js";

const dataArray = JSON.parse(localStorage.getItem('dataArray')) || [];

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
    const date = new Date(timestamp);

    const weekDay = weekDays[date.getDay()];

    return `${weekDay} ${formatHours(timestamp)}`;
}

function formatHours(timestamp) {
    const date = new Date(timestamp);

    const hours = ("0" + date.getHours()).slice(-2);
    const minutes = ("0" + date.getMinutes()).slice(-2);

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
    const celsiusCurrentTemp = Math.round(response.data.main.temp);

    cityElement.innerHTML = response.data.name;
    dateElement.innerHTML = formatDate(response.data.dt * 1000);
    descriptionElement.innerHTML = response.data.weather[0].description;
    weatherIconElement.setAttribute(
        "src",
        `http://openweathermap.org/img/wn/${iconElement}@2x.png`
    );
    weatherIconElement.setAttribute("alt", response.data.weather[0].description);
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
    axiosInstance.get('weather', {
        params: {
            "q": city,
        },
    }).then(displayRealTemp);

    axiosInstance.get('forecast', {
        params: {
            "q": city,
        },
    }).then(displayForecast);
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

        axiosInstance.get('weather', {
            params: {
                "lat": latitude,
                'lon': longitude,
            },
        }).then(displayRealTemp);

        axiosInstance.get('forecast', {
            params: {
                "lat": latitude,
                'lon': longitude,
            },
        }).then(displayForecast);
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

            axiosInstance.get('weather', {
                params: {
                    "q": arrInputValues[i].value,
                },
            }).then(function (response) {
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
    axiosInstance.get('weather', {
        params: {
            "q": city,
        },
    }).then(drawCard);
}

const mainBtn = document.querySelector('.main-btn');
mainBtn.addEventListener("click", function (event) {
    event.preventDefault();

    const mainInput = document.querySelector('.search-main')

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


