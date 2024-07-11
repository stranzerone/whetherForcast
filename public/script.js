const apiKey = '8a349082bb2fea1bde1af9894c251850';

const LoadingError = document.querySelector("#forecast");

function getWeatherByCity() {
  const city = document.getElementById('cityInput').value || 'pune';

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      if (data.cod !== 200) {
        console.log(data);
        LoadingError.innerHTML = data.message;
      } else {
        console.log(data);
        displayWeather(data);
      }
    })
    .catch(error => {
      console.error('Error fetching data:', error);
      LoadingError.innerHTML = 'Error fetching data';
    });
}

function getCurrentLocationWeather() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(position => {
      const lat = position.coords.latitude;
      const lon = position.coords.longitude;
      fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`)
        .then(response => response.json())
        .then(data => {
          if (data.cod !== 200) {
            console.log(data);
            LoadingError.innerHTML = data.message;
          } else {
            console.log(data);
            displayWeather(data);
          }
        })
        .catch(error => {
          console.error('Error fetching data:', error);
          LoadingError.innerHTML = 'Error fetching data';
        });
    }, error => {
      console.error('Geolocation error:', error);
      LoadingError.innerHTML = 'Geolocation error';
    });
  } else {
    alert('Geolocation is not supported by this browser.');
  }
}

function displayWeather(data) {
  document.getElementById('currentTemp').innerText = `${data.main.temp}°C`;
  document.getElementById('currentWeather').innerText = data.weather[0].description;
  document.getElementById('currentHumidity').innerText = data.main.humidity;
  document.getElementById('currentPressure').innerText = data.main.pressure;
  document.getElementById('currentWind').innerText = data.wind.speed;
  document.getElementById('currentCity').innerHTML = data.name;
  document.getElementById('currentDate').innerHTML = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' });

  const iconId = data.weather[0].icon;
  const iconUrl = `http://openweathermap.org/img/wn/${iconId}.png`;
  document.getElementById('currentIcon').src = iconUrl;

  // Fetch forecast for the next 4 days
  const cityId = data.id;

  fetch(`https://api.openweathermap.org/data/2.5/forecast?id=${cityId}&units=metric&appid=${apiKey}`)
    .then(response => response.json())
    .then(data => {
      const forecastContainer = document.getElementById('forecast');
      forecastContainer.innerHTML = '';

      const slicedData = data.list.slice(0, 4); // Next 4 entries for the forecast
      slicedData.forEach((weather, index) => {
        const card = document.createElement('div');
        card.classList.add('card', 'bg-transparent', 'bg-opacity-70', 'text-center', 'w-full', 'md:w-[20vw]', 'h-[100%]', 'rounded-xl', 'shadow-lg', 'flex', 'items-center', 'justify-center', 'p-4');
        card.innerHTML = `
          <div>
            <div class='flex flex-col md:flex-row gap-5 border border-gray-100 p-3 rounded-lg'>
              <div>
                <p class="text-lg">${weather.main.temp}°C</p>
                <img src="http://openweathermap.org/img/wn/${weather.weather[0].icon}.png" alt="Weather Icon" class="w-12 h-12 mx-auto">
                <p>${new Date(new Date().setDate(new Date().getDate() + index + 1)).toLocaleDateString('en-GB', { weekday: 'long' })}</p>
              </div>
              <div class='text-center'>
                <p class="text-sm"><i class="fas fa-tachometer-alt"></i> ${weather.main.pressure} hPa</p>
                <p><i class="fas fa-wind"></i> ${weather.wind.speed} km/h</p>
                <p class="text-sm"><i class="fas fa-tint"></i> ${weather.main.humidity}%</p>
                <p class="text-sm">${weather.weather[0].description}</p>
              </div>
            </div>
          </div>
        `;
        forecastContainer.appendChild(card);
      });
    })
    .catch(error => {
      console.error('Error fetching forecast data:', error);
      LoadingError.innerHTML = 'Error fetching forecast data';
    });
}

// Initial load with a default city
getWeatherByCity();
