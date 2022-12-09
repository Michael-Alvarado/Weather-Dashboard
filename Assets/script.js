// Array to store all searches performed from local storage
const searchHist = [];

init();

// Adding event listener to the clear history button
let clrHistBtn = document.getElementById('clearBtn');
clrHistBtn.addEventListener('click', function (event) {
	event.preventDefault();
	deleteButtons();
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

// Adding event listeners to buttons from past searches
var tempBtn = document.querySelector('.pastBox');
tempBtn.addEventListener('click', function (event) {
	var search = event.target.innerText;
	cityLocation(search);
});

// Function to pull content from local storage from previous visit(s) on page load
function init() {
	// Creating a new form for Side Bar
	var newForm = document.createElement('form');
	newForm.classList.add('form-group');

	// Creating the label for the form
	var formLabel = document.createElement('label');
	formLabel.textContent = 'Search for a City:';
	formLabel.setAttribute('form', 'citySearch');

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

	var pastBox = document.createElement('div');
	pastBox.classList.add('pastBox');

	// Appending the form to the Side Bar
	document.querySelector('.searchBar').appendChild(newForm);
	document.querySelector('.searchBar').appendChild(pastBox);
	pastSearch();
}

// Function to pull content from local storage from previous visit(s) on page load & create buttons for previous searches
function pastSearch() {
	var i = 0;
	searchHist.length = 0;
	while (localStorage.getItem(`City${i}`)) {
		searchHist.push(localStorage.getItem(`City${i}`));
		createButton(searchHist[i]);
		i++;
	}
}

// Function to create button after search or on init of page
function createButton(city) {
	var newBtn = document.createElement('button');
	newBtn.classList.add('btn', 'btn-block');
	newBtn.setAttribute('id', city);
	newBtn.textContent = city;

	var newLiEl = document.createElement('li');
	newLiEl.classList.add('list-group-item', 'history-button');
	newLiEl.append(newBtn);
	document.querySelector('.pastBox').appendChild(newLiEl);
}

// Function to clear local storage and remove past search buttons
function deleteButtons() {
	localStorage.clear();
	for (var i = 0; i < searchHist.length; i++) {
		buttonToDelete = document.getElementById(`${searchHist[i]}`);
		buttonToDelete.parentNode.remove();
	}
	searchHist.length = 0;
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
			let icon = data.weather[0].icon;
			let weatherDescription = data.weather[0].main;
			let windSpeed = data.wind.speed;
			let currentTemp = Math.round(data.main.temp);
			let humidity = data.main.humidity;
			let sunUp = new Date(data.sys.sunrise * 1000);
			let sunRise, sunSet;
			if (sunUp.getMinutes() < 10) {
				sunRise = sunUp.getHours() + ':0' + sunUp.getMinutes();
			} else {
				sunRise = sunUp.getHours() + ':' + sunUp.getMinutes();
			}
			let sunDown = new Date(data.sys.sunset * 1000);
			if (sunDown.getHours() < 12) {
				sunSet = sunDown.getHours() + ':' + sunDown.getMinutes();
			} else {
				sunSet = sunDown.getHours() - 12 + ':' + sunDown.getMinutes();
			}
			let today =
				sunDown.getMonth() +
				1 +
				'/' +
				sunUp.getDate() +
				'/' +
				sunUp.getFullYear();

			// Call function to populate main area of page
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

// Function to capture forecast data from API call
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
			forecastCards(data);
		});
}

// function to take current weather data and populate card with information
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

// Function to take forecast data and populate forecast cards
function forecastCards(forecastData) {
	const dates = [];
	const temps = [];
	const winds = [];
	const humidity = [];
	const icons = [];
	const descriptions = [];

	// Check to see if forecast cards are visible, make visible if not
	let enable = document.querySelector('.invisible');
	if (enable) {
		enable.classList.remove('invisible');
	}

	// Populate forecast arrays to populate the data on the cards in the next step
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

	// Populate content on forecast cards
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
