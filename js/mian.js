
const elSreachInput = document.querySelector(".search-input")
const elSreachBtn = document.querySelector(".search-btn")

const elNotFound = document.querySelector(".not-found")
const elSearchCity = document.querySelector(".search-city")
const elWeatherInfo = document.querySelector(".weather-info")

const elCityName = document.querySelector(".city-name")
const elCityTemp = document.querySelector(".city-temp")
const elCityCondition = document.querySelector(".city-condition")
const elCityHumidity = document.querySelector(".city-humidity")
const elCityWind = document.querySelector(".city-wind")
const elWeatherImg = document.querySelector(".weather-img")

const elTodayDate = document.querySelector(".today-date")

const elForecastWrapper = document.querySelector(".forecast-wrapper")

const apiKey = '44c8ae6d0a046020cae3cde2159116b8'

elSreachBtn.addEventListener("click", () => {
    if(elSreachInput.value.trim() !=  ""){
        updateWeatherInfo(elSreachInput.value)
        elSreachInput.value = ''
        elSreachInput.blur()
    }
})
elSreachInput.addEventListener('keyup', (e) => {
    if(e.key === "Enter" && elSreachInput.value.trim() !=  ""){
        updateWeatherInfo(elSreachInput.value)
        elSreachInput.value = ''
        elSreachInput.blur()
    }  
})


async function getFetchData(endpPoint, city){
    const apiURL = `https://api.openweathermap.org/data/2.5/${endpPoint}?q=${city}&appid=${apiKey}&units=metric`
    
    const response = await fetch(apiURL)
    return response.json()
}

function getTodayDate(){
    const currentDate = new Date()
    const options = {
        weekday:'short',
        day:'2-digit',
        month:'short',
    }
    return currentDate.toLocaleDateString('en-GB', options)
}
function getWeatherIcon(id){
    if( id <= 232) return 'thunderstorm.svg'
    if( id <= 321) return 'drizzle.svg'
    if( id <= 531) return 'rain.svg'
    if( id <= 622) return 'snow.svg'
    if( id <= 781) return 'atmosphere.svg'
    if( id <= 800) return 'clear.svg'
    else return 'clouds.svg'
}


async function updateWeatherInfo(city){
    const weatherData = await getFetchData('weather', city)
    
    if(weatherData.cod != 200){
        showDisplaySection(elNotFound)
        return 
    }
    
    console.log(weatherData);
    const data = {
        name: weatherData.name,
        temp: weatherData.main.temp,
        humidity: weatherData.main.humidity,
        weatherID: weatherData.weather[0].id,
        weatherMain: weatherData.weather[0].main,
        windSpeed: weatherData.wind.speed
    }
    
    elCityName.textContent = data.name
    elCityTemp.textContent = Math.round(data.temp) + " °C"
    elCityCondition.textContent = data.weatherMain
    elCityHumidity.textContent = data.humidity + " %"
    elCityWind.textContent = Math.round(data.windSpeed) + " M/s"
    elWeatherImg.src = `./images/weather/${getWeatherIcon(data.weatherID)}`
    elTodayDate.textContent = getTodayDate()
    
    await updateForecastInfo(city)
    
    showDisplaySection(elWeatherInfo)
}


async function updateForecastInfo(city){
    const forecastDate = await getFetchData('forecast', city)
    
    const timeTaken = '12:00:00'
    const todayDate = new Date().toLocaleDateString('en-CA').split('T')[0]
    
    forecastDate.list.forEach(item => {
        if(item.dt_txt.includes(timeTaken) && !item.dt_txt.includes(todayDate)){
            updateForecastItems(item)
        }
        
    })
}
function updateForecastItems(data){
    console.log(data);
    
    const { dt_txt, main: { temp }, weather: [{ id }] } = data
    const date = dt_txt.split(' ')[0]    
    const [, month, day] = date.split('-')
    const formattedDate = `${day} ${new Date().toLocaleDateString("en", {month: "short"})}`
    
    const forecastItem = document.createElement('div')
    forecastItem.className = "forecast-item min-w-[78px] p-[10px] flex flex-col items-center rounded-[12px] gap-1.5 bg-white/10 duration-300 hover:bg-white/15"
    
    forecastItem.innerHTML = `
        <h5 class="!font-normal">${formattedDate}</h5>
        <img class="" src="./images/weather/${getWeatherIcon(id)}" alt="thunderstorm" width="35" height="35">
        <h5>${Math.round(temp)} °C</h5>
    `

    elForecastWrapper.appendChild(forecastItem)
}


function showDisplaySection(section){
    [elWeatherInfo, elSearchCity, elNotFound].forEach(item => item.classList.add("hidden"))
    section.classList.remove("hidden")
}