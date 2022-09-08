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
for (var i=0; i<searchHist.length; i++) {
    var tempBtn = document.getElementById(searchHist[i]);
    tempBtn.addEventListener('click', repeatSearch(searchHist[i]));
}

// Adding event listener to the button
let searchBtn = document.getElementById('searchBtn');
searchBtn.addEventListener('click', function(event) {
    event.preventDefault();
    console.log(event); // Delete before submitting
    console.log(event.composedPath()); // Delete before submitting
    const path = event.composedPath();
    console.log(path[1][0].value); // Delete before submitting

    // Logging the input to local storage
    var value = path[1][0].value;
    if (searchHist.includes(value)) {
        repeatSearch(value);
    } else {
        searchHist.push(value.trim());
        for (var i=0; i<searchHist.length; i++) {
            localStorage.setItem('City' + i, searchHist[i]);
        }
        createButton(value);
    }
});

// Function to pull content from local storage from previous visit(s) on page load
function init () {
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
    for (var i=0; i<searchHist.length; i++) {
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

}