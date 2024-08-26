const apiKey = '43c8c401d51599f7b2d5036f891eebf6'; 
const unitsToggleBtn = document.getElementById('toggleUnits');
const searchBtn = document.getElementById('searchBtn');
const cityInput = document.getElementById('cityInput');
const currentWeatherEl = document.getElementById('currentWeather');
const forecastEl = document.getElementById('forecast');

let units = 'metric'; 


function displayCurrentWeather(data) {
    const cityName = data.name;
    const temperature = data.main.temp;
    const weatherDescription = data.weather[0].description;
    const humidity = data.main.humidity;
    const windSpeed = data.wind.speed;

    
    currentWeatherEl.innerHTML = `
        <h2>${cityName}</h2>
        <p>Temperature: ${temperature}°${units === 'metric' ? 'C' : 'F'}</p>
        <p>Weather: ${weatherDescription}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${windSpeed} ${units === 'metric' ? 'm/s' : 'mph'}</p>
    `;
}

function displayForecast(data) {
 
    forecastEl.innerHTML = '';

    const filteredForecast = data.list.filter((item) =>
        item.dt_txt.includes("12:00:00") 
    );

    filteredForecast.forEach((item) => {
        const date = new Date(item.dt * 1000).toLocaleDateString();
        const temperature = item.main.temp;
        const weatherDescription = item.weather[0].description;
        const humidity = item.main.humidity;
        const windSpeed = item.wind.speed;

       
        forecastEl.innerHTML += `
            <div class="forecast-card">
                <h3>${date}</h3>
                <p>Temperature: ${temperature}°${units === 'metric' ? 'C' : 'F'}</p>
                <p>Weather: ${weatherDescription}</p>
                <p>Humidity: ${humidity}%</p>
                <p>Wind Speed: ${windSpeed} ${units === 'metric' ? 'm/s' : 'mph'}</p>
            </div>
        `;
    });
}


async function getWeather(city) {
    try {
        const weatherResponse = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=${units}`);
        const forecastResponse = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=${units}`);
        
        if (!weatherResponse.ok || !forecastResponse.ok) {
            if (weatherResponse.status === 401 || forecastResponse.status === 401) {
                throw new Error('Unauthorized: Invalid API key');
            } else if (weatherResponse.status === 404 || forecastResponse.status === 404) {
                throw new Error('City not found');
            } else if (weatherResponse.status === 429 || forecastResponse.status === 429) {
                throw new Error('Too many requests: API rate limit exceeded');
            } else {
                throw new Error('Failed to fetch weather data');
            }
        }

        const weatherData = await weatherResponse.json();
        const forecastData = await forecastResponse.json();
        
        displayCurrentWeather(weatherData); 
        displayForecast(forecastData);
    } catch (error) {
        console.error(error);
        alert('Error fetching weather data: ' + error.message);
    }
}


searchBtn.addEventListener('click', () => {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    } else {
        alert('Please enter a city name.');
    }
});

unitsToggleBtn.addEventListener('click', () => {
    units = units === 'metric' ? 'imperial' : 'metric';
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
    }
});
