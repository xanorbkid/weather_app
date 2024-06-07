// alert('hi Bronax')
document.getElementById('search-button').addEventListener('click', function () {
    const city = document.getElementById('city-input').value;
    const unit = document.querySelector('input[name="temperatureUnit"]:checked').value;
    const apiKey = '53c4d9eee2469ff8eb200663b405cf99'; // Replace with your OpenWeather API key

    if (city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=${unit}&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    document.getElementById('city-name').textContent = `${data.name}, ${data.sys.country}`;
                    document.getElementById('current-temp').textContent = `${data.main.temp}°${unit === 'metric' ? 'C' : 'F'}`;
                    document.getElementById('feels-like').textContent = `${data.main.feels_like}°${unit === 'metric' ? 'C' : 'F'}`;
                    document.getElementById('temp-max').textContent = `${data.main.temp_max}°${unit === 'metric' ? 'C' : 'F'}`;
                    document.getElementById('temp-min').textContent = `${data.main.temp_min}°${unit === 'metric' ? 'C' : 'F'}`;
                    document.getElementById('weather-description').textContent = data.weather[0].description;
                    document.getElementById('weather-icon').className = `fas fa-3x ${getWeatherIconClass(data.weather[0].main)}`;
                    document.getElementById('weather-card').style.display = 'block';
                } else {
                    alert('City not found');
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        alert('Please enter a city name');
    }
});

function getWeatherIconClass(weather) {
    switch (weather.toLowerCase()) {
        case 'clear':
            return 'fa-sun';
        case 'clouds':
            return 'fa-cloud';
        case 'rain':
            return 'fa-cloud-showers-heavy';
        case 'snow':
            return 'fa-snowflake';
        default:
            return 'fa-cloud';
    }
}

// Dashboard Report
document.getElementById('search-button-dashboard').addEventListener('click', function () {
    const city = document.getElementById('city-input-dashboard').value;
    const apiKey = '53c4d9eee2469ff8eb200663b405cf99'; // Replace with your OpenWeather API key
    


    if (city) {
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.cod === 200) {
                    updateCurrentWeather(data);
                    fetchForecastData(city, apiKey);
                } else {
                    alert('City not found');
                }
            })
            .catch(error => console.error('Error:', error));
    } else {
        alert('Please enter a city name');
    }
});

function fetchForecastData(city, apiKey) {
    fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            if (data.cod === '200') {
                updateHourlyWeather(data);
                updateDailyWeather(data);
            } else {
                alert('Forecast data not available');
            }
        })
        .catch(error => console.error('Error:', error));
}

function updateCurrentWeather(data) {
    document.getElementById('current-temp-dashboard').textContent = `${data.main.temp}°C`;
    document.getElementById('current-location').textContent = `${data.name}, ${data.sys.country}`;
    document.getElementById('current-weather-icon').src = `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
}

function updateHourlyWeather(data) {
    const hourlyContainer = document.getElementById('hourly-weather');
    hourlyContainer.innerHTML = '';

    const hourlyData = data.list.slice(0, 5); // Get the first 5 entries for the next few hours
    hourlyData.forEach(hour => {
        const hourElement = document.createElement('div');
        hourElement.classList.add('flex-column');
        hourElement.innerHTML = `
           
            <p class="small"><strong>${hour.main.temp}°C</strong></p>
            <img src="http://openweathermap.org/img/wn/${hour.weather[0].icon}.png" class="mb-3" alt="Weather Icon">
            <p class="mb-0"><strong>${new Date(hour.dt_txt).getHours()}:00</strong></p>
            <p class="mb-0 text-muted" style="font-size: .65rem;">${new Date(hour.dt_txt).getHours() < 12 ? 'AM' : 'PM'}</p>
        `;
        hourlyContainer.appendChild(hourElement);
    });
}

function updateDailyWeather(data) {
    const dailyContainer = document.getElementById('daily-weather');
    dailyContainer.innerHTML = '';

    const dailyData = data.list.filter(item => item.dt_txt.includes('12:00:00')).slice(0, 5); // Get daily data at noon
    dailyData.forEach(day => {
        const dayElement = document.createElement('div');
        dayElement.classList.add('flex-column');
        const dayOfWeek = new Date(day.dt_txt).toLocaleString('default', { weekday: 'short' });
        dayElement.innerHTML = `
           

            <p class="small"><strong>${day.main.temp}°C</strong></p>
            <img src="http://openweathermap.org/img/wn/${day.weather[0].icon}.png" class="mb-3" alt="Weather Icon">
            <p class="mb-0"><strong>${dayOfWeek}</strong></p>
        `;
        dailyContainer.appendChild(dayElement);
    });
}