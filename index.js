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
    let cityElement = document.querySelector("#city");
    let dateElement = document.querySelector("#date");
    let descriptionElement = document.querySelector("#weather-description");
    let weatherIconElement = document.querySelector("#weather-icon");
    let tempElement = document.querySelector("#temp");
    let humidityElement = document.querySelector("#humidity");
    let windElement = document.querySelector("#wind");


    let iconElement = response.data.weather[0].icon;
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

    cityInput.value = '';
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
    let arrDelBtn = [];
    let arrBoxBtn = [];

    const weath = document.querySelector('.smallWeather');
    arrDelBtn = document.querySelectorAll('.deleteBtn')
    arrBoxBtn = document.querySelectorAll('.orange');


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
    let arrDelBtn = [];
    let arrUpdateBtns = [];
    let arrInputValues = [];
    let arrBoxBtn = [];


    arrUpdateBtns = document.querySelectorAll('.editBtn');
    arrInputValues = document.querySelectorAll('.updateInput');
    arrBoxBtn = document.querySelectorAll('.orange');
    arrDelBtn = document.querySelectorAll('.deleteBtn')


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



let mainBtn = document.querySelector('.main-btn');
mainBtn.addEventListener("click", function (event) {
    event.preventDefault();


    let mainInput = document.querySelector('.search-main')

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
