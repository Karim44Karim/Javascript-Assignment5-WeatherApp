const API_KEY = "07fea89a91ea4473a06213536252006";
const BASE_URL = "http://api.weatherapi.com/v1/forecast.json";
const FORECAST_DAYS = 3;

let data, day;
const alertMessage = document.getElementById("alertMessage");


let cityName = document.getElementById("cityName");
let today = document.getElementById("today");
let currentDate = document.getElementById("date");
let currentTemp = document.getElementById("temperature");
let condition = document.getElementById("condition");
let conditionIcon = document.getElementById("conditionIcon");
let currentHumidity = document.getElementById("humidity");
let currentWindSpeed = document.getElementById("windSpeed");
let curremtWindDirection = document.getElementById("windDirection");

let tomorrow = document.getElementById("tomorrow");
let maxTempTomorrow = document.getElementById("maxTempTomorrow");
let minTempTomorrow = document.getElementById("minTempTomorrow");
let conditionIconTomorrow = document.getElementById("conditionIconTomorrow");
let conditionTextTomorrow = document.getElementById("conditionTextTomorrow");
let averageHumidityTomorrow = document.getElementById("averageHumidityTomorrow");
let maxWindSpeedTomorrow = document.getElementById("maxWindSpeedTomorrow");


let afterTomorrow = document.getElementById("afterTomorrow");
let maxTempAfterTomorrow = document.getElementById("maxTempAfterTomorrow");
let minTempAfterTomorrow = document.getElementById("minTempAfterTomorrow");
let conditionIconAfterTomorrow = document.getElementById("conditionIconAfterTomorrow");
let conditionTextAfterTomorrow = document.getElementById("conditionTextAfterTomorrow");
let averageHumidityAfterTomorrow = document.getElementById("averageHumidityAfterTomorrow");
let maxWindSpeedAfterTomorrow = document.getElementById("maxWindSpeedAfterTomorrow");

let locationData = {}; 

let currentView;


const searchInput = document.getElementById("searchInput");
const findBtn = document.getElementById("findBtn");

const outputSection = document.getElementById("outputSection");
const loading = document.getElementById("loading");

const views = ["homeView", "contactView"];

if (localStorage.getItem("currentView") == null){
  currentView = "homeView";
  localStorage.setItem("currentView", "homeView");
  setCurrentView("homeView");
} else{
  currentView = localStorage.getItem("currentView");
  setCurrentView(currentView);
}


searchInput.addEventListener("input", function(){getData();});
findBtn.addEventListener("click", function(){getData();});


async function getData() {

  let url;
  let response;
  
  loading.classList.replace("d-none", "d-flex");
  outputSection.classList.replace("d-flex", "d-none");
  try {
    if (searchInput.value == ""){
      await getLocation();
    url = `${BASE_URL}?key=${API_KEY}&q=${locationData.latitude},${locationData.longitude}&days=${FORECAST_DAYS}&aqi=no&alerts=no`;
    } else if(searchInput.value !=""){
      url = `${BASE_URL}?key=${API_KEY}&q=${searchInput.value}&days=${FORECAST_DAYS}&aqi=no&alerts=no`;
    } else{
      url = `${BASE_URL}?key=${API_KEY}&q=${cairo}&days=${FORECAST_DAYS}&aqi=no&alerts=no`;
    }
    response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Response status: ${response.status}`);
    }

    const json = await response.json();
    data = json;
    alertMessage.classList.replace("d-block", "d-none");
    alertMessage.textContent = "";
    loading.classList.replace("d-flex", "d-none");
    outputSection.classList.replace("d-none", "d-flex");
    displayData();
  } catch (error) {
    if(response .status == 400){
      alertMessage.classList.replace("d-none", "d-block");
      loading.classList.replace("d-flex", "d-none");
      alertMessage.textContent = "location not found :(";
  }
    else{
        alertMessage.classList.replace("d-none", "d-block");
        alertMessage.textContent = `error ${response.status}` ;
    }
  }
}

  async function getLocation() {
    return new Promise (function(resolve, reject){
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position){
            locationData ={
                latitude: position.coords.latitude.toPrecision(6),
                longitude: position.coords.longitude.toPrecision(6),
              }
              resolve();
          }, function(error){
            alert("Sorry, no position available.");
            loading.classList.replace("d-flex", "d-none");
            reject(error);
          });
        } else {
          alert("Geolocation is not supported by this browser.");
          reject(new Error("Geolocation not supported"));
        }
    });
}


function displayData(){
    cityName.textContent = data.location.name;
    today.textContent = findDay(data.current.last_updated);
    currentDate.textContent = findDate(data.current.last_updated);
    currentTemp.textContent = data.current.temp_c + '°C';
    condition.textContent = data.current.condition.text;
    conditionIcon.src = data.current.condition.icon;
    currentHumidity.textContent = data.current.humidity+"%";
    currentWindSpeed.textContent = data.current.wind_kph + "km/h";
    curremtWindDirection.textContent = windDir(data.current.wind_dir);

    tomorrow.textContent = findDay(data.forecast.forecastday[1].date);
    maxTempTomorrow.textContent = data.forecast.forecastday[1].day.maxtemp_c+ '°C';
    minTempTomorrow.textContent = data.forecast.forecastday[1].day.mintemp_c+ '°C';
    conditionIconTomorrow.src = data.forecast.forecastday[1].day.condition.icon;
    conditionTextTomorrow.textContent = data.forecast.forecastday[1].day.condition.text;
    averageHumidityTomorrow.textContent = data.forecast.forecastday[1].day.avghumidity+"%";
    maxWindSpeedTomorrow.textContent = data.forecast.forecastday[1].day.maxwind_kph+ "km/h";

    afterTomorrow.textContent = findDay(data.forecast.forecastday[2].date);
    maxTempAfterTomorrow.textContent = data.forecast.forecastday[2].day.maxtemp_c+ '°C';
    minTempAfterTomorrow.textContent = data.forecast.forecastday[2].day.mintemp_c+ '°C';
    conditionIconAfterTomorrow.src = data.forecast.forecastday[2].day.condition.icon;
    conditionTextAfterTomorrow.textContent = data.forecast.forecastday[2].day.condition.text;
    averageHumidityAfterTomorrow.textContent = data.forecast.forecastday[2].day.avghumidity+"%";
    maxWindSpeedAfterTomorrow.textContent = data.forecast.forecastday[2].day.maxwind_kph+ "km/h";
}

function findDay(input){
  const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday", "Saturday"];
  let date = new Date(input);
  return  weekday[date.getDay()];
}
function findDate(input){
  const month = ["January","February","March","April","May","June","July","August","September","October","November","December"];
  let date = new Date(input);
  return date.getDate() + ' ' + month[date.getMonth()];
}


function windDir(input){
  let output;
  switch (input) {
    case "N":
      output = "North";
      break;
    case "E":
      output = "East";
      break;
    case "S":
      output = "South";
      break;
    case "W":
      output = "West";
      break;
    case "NE":
    case "NNE":
    case "ENE":
      output = "North East";
      break;
    case "NW":
    case "NNW":
    case"WNW":
      output = "North West";
      break;
    case "SE":
    case "SSE":
    case "ESE":
      output = "South East";
      break;
    case "SW":
    case "SSW":
    case "WSW":
      output = "South West";
      break;
    default:
      break;
  }
  return output;
}
function viewPage(){
  for( let i = 0;i<views.length;i++){
    if(views[i] == currentView){
      document.getElementById(views[i]).classList.remove("d-none");
      document.getElementById(views[i]).classList.add("d-block");
    } else{
      document.getElementById(views[i]).classList.remove("d-block");
      document.getElementById(views[i]).classList.add("d-none");
    }
  }
}
function setCurrentView (view){
    let navLinks = document.querySelectorAll("#navbarSupportedContent a");
    navLinks.forEach(element => {
      if(element.textContent.toLowerCase() + "View" == view ){
        element.classList.add('active');
      } else{
        element.classList.remove('active');
      }
    });
    currentView = view;
    localStorage.setItem("currentView", view)
    viewPage();
    if(view == "homeView"){
      getData();
      }
}