// Array to store all searches performed from local storage
const searchHist = [];

// Creating a new form for Side Bar
var newForm = document.createElement('form');

// Creating the label for the form
var formLabel = document.createElement('label');
formLabel.textContent = 'Search for a City:';
formLabel.setAttribute('for', 'citySearch');

// Creating the input for the form
var formInput = document.createElement('input');
formInput.placeholder = 'San Diego';
formInput.name = 'citySearch';
formInput.type = 'text';
formInput.setAttribute('id', 'citySearch');

// Creating the button for the form
var formBtn = document.createElement('button');
formBtn.setAttribute('id', 'searchBtn');
formBtn.textContent = 'Search';

// Appending the pieces of the form to the form
newForm.append(formLabel);
newForm.append(formInput);
newForm.append(formBtn);

// Appending the form to the Side Bar
document.querySelector('.searchBar').appendChild(newForm);

init();

// Adding event listeners to buttons from past searches
for (var i = 0; i < searchHist.length; i++) {
	var tempBtn = document.getElementById(searchHist[i]);
	tempBtn.addEventListener('click', repeatSearch(searchHist[i]));
}

// Adding event listener to the button
let searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', function (event) {
	event.preventDefault();
	const path = event.composedPath();
	console.log(path[1][0].value); // Delete before submitting

	// Logging the input to local storage
	var value = path[1][0].value;
	if (searchHist.includes(value)) {
		repeatSearch(value);
	} else {
		searchHist.push(value.trim());
		for (var i = 0; i < searchHist.length; i++) {
			localStorage.setItem('City' + i, searchHist[i]);
		}
		createButton(value);
		cityLocation(value);
	}
});

// Function to pull content from local storage from previous visit(s) on page load
function init() {
	var i = 0;
	searchHist.length = 0;
	while (localStorage.getItem('City' + i)) {
		searchHist.push(localStorage.getItem('City' + i));
		console.log(searchHist[i]);
		i++;
	}
	pastSearch();
}

// Function to create buttons for previous searches
function pastSearch() {
	for (var i = 0; i < searchHist.length; i++) {
		createButton(searchHist[i]);
	}
}

// Function to create button after search or on init of page
function createButton(city) {
	var newBtn = document.createElement('button');
	newBtn.classList.add('pastBtn');
	newBtn.setAttribute('id', city);
	newBtn.textContent = city;

	var newLiEl = document.createElement('li');
	newLiEl.classList.add('list-group');
	newLiEl.append(newBtn);
	document.querySelector('.pastBar').appendChild(newLiEl);
}

// Function to pull API data for a previous search result
function repeatSearch(city) {
	cityLocation(city);
}

// Function to gather latitude and longitude coordinates of city for weather API call
function cityLocation(city) {
	fetch(
		'https://api.openweathermap.org/geo/1.0/direct?q=' +
			city +
			'&appid=1e534b54b0449b07d430333925ecb55a'
	)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data[0].lat);
			console.log(data[0].lon);
			getWeather(data[0].lat, data[0].lon);
			getForecast(data[0].lat, data[0].lon);
		});
}

// Function to collect weather API data based on passed latitude and longitude coordinates
function getWeather(lat, lon) {
	fetch(
		'https://api.openweathermap.org/data/2.5/weather?lat=' +
			lat +
			'&lon=' +
			lon +
			'&units=imperial&appid=1e534b54b0449b07d430333925ecb55a'
	)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			let description = data.weather[0].description;
			console.log(description);
			let weatherId = data.weather[0].main;
			console.log(weatherId);
			let windSpeed = data.wind.speed;
			console.log('Wind speed: ' + windSpeed + ' mph');
			let clouds = data.clouds.all;
			console.log('Cloudiness %: ' + clouds);
			let currentTemp = Math.round(data.main.temp);
			console.log(currentTemp + '\u00B0');
			let humidity = data.main.humidity;
			console.log('Humidity %: ' + humidity);
			let sunUp = new Date(data.sys.sunrise * 1000);
			let sunRise = sunUp.getHours() + ':' + sunUp.getMinutes();
			console.log('Sunrise: ' + sunRise + 'am');
			let sunDown = new Date(data.sys.sunset * 1000);
			let sunSet = sunDown.getHours() - 12 + ':' + sunDown.getMinutes();
			console.log('Sunset: ' + sunSet + 'pm');
		});
}

function getForecast(lat, lon) {
	fetch(
		'https://api.openweathermap.org/data/2.5/forecast?lat=' +
			lat +
			'&lon=' +
			lon +
			'&units=imperial&appid=1e534b54b0449b07d430333925ecb55a'
	)
		.then((response) => {
			return response.json();
		})
		.then((data) => {
			console.log(data);
		});
}

function mainCard() {}

function forecastCards() {}
