// Elements
var allCountries = null;
var allCountriesSelect = document.getElementById('allcountries');
var capitalSpan = document.getElementById('capital');
var timezoneSpan = document.getElementById('timezone');
var languageSpan = document.getElementById('language');
var currencySpan = document.getElementById('currency');
var bordersUl = document.getElementById('borders');
var flagImg = document.getElementById('flag');
var regionalTableBody = document.getElementById('regional-data');
var map = null;


// Functions
function getCountryList() {
    var url = 'https://restcountries.eu/rest/v2/all';
    var xhttp;
    xhttp=new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            processCountryList(this);
        }
    };
    xhttp.open("GET", url, true);
    xhttp.send();
}

function processCountryList(xhttp) {
    allCountries = JSON.parse( xhttp.responseText);
    if(allCountries){
        allCountries.forEach( function(country){
            var option = document.createElement('option');
            option.value = country.name;
            option.appendChild(document.createTextNode(country.name));
            allCountriesSelect.appendChild(option);
        })
    }
}

function getCountry(countryName){
    var returnCountry = null;
    if(allCountries){
        returnCountry = allCountries.find( country => country.name === countryName);
    }
    return returnCountry;
}

function processCountry(countryName){
    var country = getCountry(countryName); //get country data

    console.log(country);

    capitalSpan.innerHTML = country.capital; //set capital
    timezoneSpan.innerHTML = country.timezones[0]; //set timezone (first)
    languageSpan.innerHTML = country.languages[0].name; //set language (first)
    currencySpan.innerHTML = country.currencies[0].code; //set currency (first)

    bordersUl.innerHTML = ""; //set borders
    country.borders.forEach( function(border){
        var li = document.createElement('li');
        li.appendChild(document.createTextNode(border));
        bordersUl.appendChild(li);
    })

    flagImg.setAttribute('src', country.flag); //set flag

    regionalTableBody.innerHTML = ""; //set regionals
    country.regionalBlocs.forEach( function(regionalBloc){
        var tr = document.createElement('tr');
        var tdAcronym = document.createElement('td');
        var tdName = document.createElement('td');
        tdAcronym.appendChild(document.createTextNode(regionalBloc.acronym));
        tdName.appendChild(document.createTextNode(regionalBloc.name));
        tr.appendChild(tdAcronym);
        tr.appendChild(tdName);
        regionalTableBody.appendChild(tr);
    })

    updateMap(country.latlng);
}

function dropDownChange(){
    var countryName = allCountriesSelect.value;
    var country = processCountry(countryName);
}

function initMap(){
    map = L.map('map').setView([4, -56], 7);

    L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', 
    {
        attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        maxZoom: 18,
        id: 'mapbox.streets',
        accessToken: 'pk.eyJ1Ijoiam9uYXRoYW50b2JpIiwiYSI6ImNpeTd0Ymx3bjAwM28yd21wOHhpMnM4NHgifQ.V3uKfxs2hlE_y7RnivsWTQ'
    }).addTo(map);
}

function updateMap(latLng){
    map.setView(latLng);
}

function init(){
    getCountryList();
    initMap();
}

// Events
allCountriesSelect.addEventListener("change", dropDownChange);
