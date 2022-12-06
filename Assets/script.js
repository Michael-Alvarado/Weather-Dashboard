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

// Creating a button to clear search history
var clearBtn = document.createElement('button');
clearBtn.setAttribute('id', 'clearBtn');
clearBtn.textContent = 'Clear History';

// Appending the pieces of the form to the form
newForm.append(formLabel);
newForm.append(formInput);
newForm.append(formBtn);
newForm.append(clearBtn);

// Appending the form to the Side Bar
document.querySelector('.searchBar').appendChild(newForm);

init();

// Adding event listeners to buttons from past searches
for (var i = 0; i < searchHist.length; i++) {
	var tempBtn = document.getElementById(searchHist[i]);
	tempBtn.addEventListener('click', cityLocation(searchHist[i]));
}

// Adding event listener to the clear history button
let clrHistBtn = document.getElementById('clearBtn');
clrHistBtn.addEventListener('click', function (event) {
	event.preventDefault();
	searchHist.length = 0;
});

// Adding event listener to the search button
let searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', function (event) {
	event.preventDefault();
	const path = event.composedPath();
	console.log(path[1][0].value); // Delete before submitting

	// Logging the input to local storage
	var value = path[1][0].value;
	if (searchHist.includes(value)) {
		cityLocation(value);
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
	pastSearch();
}

// Function to pull content from local storage from previous visit(s) on page load & create buttons for previous searches
function pastSearch() {
	var i = 0;
	searchHist.length = 0;
	while (localStorage.getItem(`City${i}`)) {
		searchHist.push(localStorage.getItem(`City${i}`));
		console.log(searchHist[i]);
		i++;
	}
	for (var i = 0; i < searchHist.length; i++) {
		createButton(searchHist[i]);
	}
}

// Function to create button after search or on init of page
function createButton(city) {
	var newBtn = document.createElement('button');
	newBtn.classList.add('btn', 'btn-block');
	newBtn.setAttribute('id', city);
	newBtn.textContent = city;

	var newLiEl = document.createElement('li');
	newLiEl.classList.add('list-group', 'history-button');
	newLiEl.append(newBtn);
	document.querySelector('.searchBar').appendChild(newLiEl);
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
			let name = data.name;
			console.log(name);
			let icon = data.weather[0].icon;
			console.log(icon);
			let weatherDescription = data.weather[0].main;
			console.log(weatherDescription);
			let windSpeed = data.wind.speed;
			console.log('Wind speed: ' + windSpeed + ' mph');
			let currentTemp = Math.round(data.main.temp);
			console.log(currentTemp + '\u00B0');
			let humidity = data.main.humidity;
			console.log('Humidity %: ' + humidity);
			let sunUp = new Date(data.sys.sunrise * 1000);
			let sunRise, sunSet;
			if (sunUp.getMinutes() < 10) {
				sunRise = sunUp.getHours() + ':0' + sunUp.getMinutes();
			} else {
				sunRise = sunUp.getHours() + ':' + sunUp.getMinutes();
			}
			console.log('Sunrise: ' + sunRise + 'am');
			let sunDown = new Date(data.sys.sunset * 1000);
			if (sunDown.getHours() < 12) {
				sunSet = sunDown.getHours() + ':' + sunDown.getMinutes();
			} else {
				sunSet = sunDown.getHours() - 12 + ':' + sunDown.getMinutes();
			}
			console.log('Sunset: ' + sunSet + 'pm');
			let today =
				sunDown.getMonth() +
				1 +
				'/' +
				sunUp.getDate() +
				'/' +
				sunUp.getFullYear();
			console.log(today);
			console.log(data);

			mainCard(
				name,
				icon,
				weatherDescription,
				windSpeed,
				currentTemp,
				humidity,
				sunRise,
				sunSet,
				today
			);
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
			forecastCards(data);
		});
}

function mainCard(
	city,
	weatherIcon,
	description,
	windSpeed,
	currentTemp,
	humidity,
	sunRise,
	sunSet,
	date
) {
	var icon = document.getElementById(`img`);
	icon.setAttribute(
		'src',
		`http://openweathermap.org/img/wn/${weatherIcon}.png`
	);
	icon.setAttribute('alt', description);

	var cardHeader = document.getElementById('card-header');
	cardHeader.textContent = `${city} (${date})`;

	var tempLiEl = document.getElementById('temp');
	tempLiEl.textContent = `Temp: ${currentTemp}\u00B0F`;

	var windLiEl = document.getElementById('wind');
	windLiEl.textContent = `Wind: ${windSpeed}mph`;

	var humidLiEl = document.getElementById('humid');
	humidLiEl.textContent = `Humidity: ${humidity}%`;

	var sunRiseLiEl = document.getElementById('sunrise');
	sunRiseLiEl.textContent = `Sunrise: ${sunRise}AM`;

	var sunSetLiEl = document.getElementById('sunset');
	sunSetLiEl.textContent = `Sunset: ${sunSet}PM`;
}

function forecastCards(forecastData) {
	const dates = [];
	const temps = [];
	const winds = [];
	const humidity = [];
	const icons = [];
	const descriptions = [];

	for (var i = 3; i < forecastData.cnt; i += 8) {
		let tempDate = new Date(forecastData.list[i].dt * 1000);
		dates.push(
			tempDate.getMonth() +
				1 +
				'/' +
				tempDate.getDate() +
				'/' +
				tempDate.getFullYear()
		);
		temps.push(Math.round(forecastData.list[i].main.temp));
		winds.push(Math.round(forecastData.list[i].wind.speed));
		humidity.push(forecastData.list[i].main.humidity);
		icons.push(forecastData.list[i].weather[0].icon);
		descriptions.push(forecastData.list[i].weather[0].description);
	}
	console.log('Temp: ' + temps[0]);
	console.log(dates[0]);
	console.log('Wind: ' + winds[0] + 'mph');
	console.log('Humidity: ' + humidity[0] + '%');

	for (var i = 0; i < dates.length; i++) {
		let icon = document.getElementById(`img${i}`);
		icon.setAttribute(
			'src',
			`http://openweathermap.org/img/wn/${icons[i]}.png`
		);
		icon.setAttribute('alt', descriptions[i]);
		let title = document.getElementById(`title${i}`);
		title.textContent = dates[i];
		let tempLiEl = document.getElementById(`temp${i}`);
		tempLiEl.textContent = `Temp: ${temps[i]}\u00B0F`;
		let windLiEl = document.getElementById(`wind${i}`);
		windLiEl.textContent = `Wind: ${winds[i]}mph`;
		let humidLiEl = document.getElementById(`humid${i}`);
		humidLiEl.textContent = `Humidity: ${humidity[i]}%`;
	}
}
