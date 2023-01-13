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


    smallWeather.appendChild(miniBox);
    miniBox.appendChild(deleteBtn);
    miniBox.appendChild(updateInput);
    miniBox.appendChild(updateBtn);


    return [updateBtn, updateInput, miniBox, deleteBtn, smallWeather]
}


function drawCard(response) {
    const forecast = response.data;


    dataArray.push(forecast);
    localStorage.setItem('dataArray', JSON.stringify(dataArray));

    const cardElemetns = createElement(forecast);

    dataArray.forEach(function (el, index) {

        cardElemetns[0].onclick = () => {
            let baseUrl = `${apiUrl}weather?q=${cardElemetns[1].value}&appid=${apiKey}&units=metric`;


            axios.get(baseUrl).then(function (response) {
                dataArray[index] = response.data;


                localStorage.setItem('dataArray', JSON.stringify(dataArray));


                cardElemetns[2].innerHTML = `<strong>${response.data.name}</strong><br>${Math.round(response.data.main.temp)}ºC`;


                cardElemetns[2].appendChild(cardElemetns[0]);
                cardElemetns[2].appendChild(cardElemetns[1]);
                cardElemetns[2].appendChild(cardElemetns[3]);
            });
        }


        cardElemetns[3].onclick = () => {
            dataArray.splice(index, 1);
            localStorage.setItem('dataArray', JSON.stringify(dataArray));

            cardElemetns[4].removeChild(cardElemetns[2]);

        }
    });

}


function searchForCard(city) {
    let baseUrl = `${apiUrl}weather?q=${city}&appid=${apiKey}&units=metric`;


    axios.get(baseUrl).then(drawCard);


}




let mainBtn = document.querySelector('.main-btn');
mainBtn.addEventListener("click", function (event) {
    event.preventDefault();


    let mainInput = document.querySelector('.search-main')


    searchForCard(mainInput.value);
})



dataArray.forEach(function (el, index) {
    const cardElemetns = createElement(el);


    cardElemetns[0].onclick = () => {
        let baseUrl = `${apiUrl}weather?q=${cardElemetns[1].value}&appid=${apiKey}&units=metric`;


        axios.get(baseUrl).then(function (response) {
            dataArray[index] = response.data;


            localStorage.setItem('dataArray', JSON.stringify(dataArray));


            cardElemetns[2].innerHTML = `<strong>${response.data.name}</strong><br>${Math.round(response.data.main.temp)}ºC`;


            cardElemetns[2].appendChild(cardElemetns[0]);
            cardElemetns[2].appendChild(cardElemetns[1]);
            cardElemetns[2].appendChild(cardElemetns[3]);
        });
    }


    cardElemetns[3].onclick = () => {
        dataArray.splice(index, 1);


        localStorage.setItem('dataArray', JSON.stringify(dataArray));


        cardElemetns[4].removeChild(cardElemetns[2]);

    }
});

