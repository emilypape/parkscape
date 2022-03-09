// set up necessary variables

var parkSelectionInput = document.querySelector('#park-selection');
var submitBtn = document.querySelector('#submit-btn');
let parkInfoContain = document.querySelector("#national-park-container");
let parkFormContain = document.querySelector("#park-form-container");
let gbBtnEl = document.querySelector("#gb-btn");
let visitBtnEl = document.querySelector("#visitor-btn");
let activityBtnEl = document.querySelector('#activity-btn');
let visitorPageContain = document.querySelector("#visitor-info-container");
let activityPageContain = document.querySelector('#best-hikes-container');

// end global variables

// get time values
var currentDay = moment()
var fromValue = moment().format('YYYY-MM-DD')
currentDay.add(1, "day")
var toValue = currentDay.format("YYYY-MM-DD")
currentDay.add(6, "day")
var maxValue = currentDay.format("YYYY-MM-DD")
currentDay.add(1, "day")
var toMaxValue = currentDay.format("YYYY-MM-DD")
var fromEl = document.getElementById("from")

fromEl.setAttribute("value", fromValue)

fromEl.setAttribute("max", maxValue)
var toEl = document.getElementById("to")

toEl.setAttribute("value", toValue)

toEl.setAttribute("max", toMaxValue)

toEl.setAttribute("min", toValue)
fromEl.setAttribute("min", fromValue)

//end time values 

// api key for the project
var key = '2JLCuHgadecfJrBe7FWSG7jOky4xF2fjg5Q5O458';

// function that fetchest the national park API with necessary parameters
function nationalParkFetch (parks) {
    // park code will accept the typed in park name as the code, already checked
    var NatParkUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parks}&api_key=${key}`
    // park name and info that goes along with park parameter fetch
    fetch(NatParkUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(parkData) {
                //console.log(parkData);
                pInfoPage(parkData);
            })
         }
       })
    }


//user input National park selection
var mainPageSubmit= function () {
    var parkSelect = document.getElementById("park-selection")
    

    //document.getElementById("map").remove()
    var parkCode = parkSelect.options[parkSelect.selectedIndex].value
    var nationalParkApi = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=dXZ1UXqLPTZyKYJ7zQInqlAulIuLnYesbCyyDJFR`;
    fetch(nationalParkApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                const lat = data.data[0].latitude;
                const long = data.data[0].longitude;


                var L = window.L
                var mapEl = document.querySelector("#map");
                mapEl.style.height = "180px"
                mapEl.style.width = "180px"
                document.getElementById("mapbox").appendChild(mapEl)
                var map = L.map('map')
                map.setView([51.505, -0.09], 13);
                L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}', {
                    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
                    maxZoom: 18,
                    id: 'mapbox/streets-v11',
                    tileSize: 512,
                    zoomOffset: -1,
                    accessToken: 'pk.eyJ1IjoianVsaWVwZXRlODciLCJhIjoiY2wwYnQzd2UxMGxxMDNpbWh6eXhoY2Y4byJ9.FDcbw_dit0NRTs6V79kEXg'
                }).addTo(map);
                L.marker([lat, long]).addTo(map)
                    .bindPopup(data.data[0].fullName)
                    .openPopup();
            })

        } else {
            console.log("failed");
        }
    })

}

function thingsToDoFetch(parks) {
    var thingsToDoUrl = `https://developer.nps.gov/api/v1/thingstodo?parkCode=${parks}&api_key=${key}`
    fetch(thingsToDoUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (thingsToDoData) {
                console.log(thingsToDoData);
            })
        }
    })
}

// function that fetchest the national park API with necessary parameters
function nationalParkFetch(parks) {
    // park code will accept the typed in park name as the code, already checked
    var NatParkUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parks}&api_key=${key}`
    // park name and info that goes along with park parameter fetch
    fetch(NatParkUrl).then(function (response) {
        if (response.ok) {
            response.json().then(function (parkData) {
                pInfoPage(parkData);
            })
        }
    })
}

// click listener function for the best hikes section
function thingsToDoClickEvent() {
    var parks = parkSelectionInput.value
    thingsToDoFetch(parks);
}

// click event function for park selection to keep fetch function pure for further use
// this function can also house the information for dates
// ***!!!JULIE!!!*** grab date info here, this is for the submit button!
function submitBtnClickEvent(e) {
    // I styled the html in a form, so this keeps the page from auto refreshing
    e.preventDefault();
    // capture the input for park selection
    var parks = parkSelectionInput.value;
    //console.log(parkSelectionInput.value);
    // call the function with the info fetch with the argument 'parks' which is the input value
    nationalParkFetch(parks);
    parkInfoContain.className = "nationalParkContainer";
    parkFormContain.className = "parkFormContainer hidden";
    mainPageSubmit();
}





// Script elements for park page

let pInfoPage = function(parkInfo){
    var weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${parkInfo.data[0].latitude}&lon=${parkInfo.data[0].longitude}&appid=89de62b6d12dc85d6af194716b54e779`;

    fetch(weatherApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                let fBoxEl = document.querySelectorAll("#weather-card");
                for (let i = 0 ; i < fBoxEl.length ; i++) {
                    fBoxEl[i].querySelector("img").setAttribute("src", "https://openweathermap.org/img/wn/" + data.daily[i].weather[0].icon + ".png");
                    fBoxEl[i].querySelector("img").setAttribute("alt",  data.daily[i].weather[0].description);
                    fBoxEl[i].querySelector("span").textContent = new Date(data.daily[i].dt * 1000).toLocaleDateString();
                    fBoxEl[i].querySelector("p").textContent = data.daily[i].weather[0].description;
                }
            })
        }
    })
    let parkNameEl = document.querySelector("#park-name");
    parkNameEl.textContent = parkInfo.data[0].name;

    let parkDescEl = document.querySelector("#park-overview");
    parkDescEl.textContent = parkInfo.data[0].description;

    let parkImageEl = document.querySelector("#park-picture");
    parkImageEl.setAttribute("src", parkInfo.data[0].images[0].url);
    parkImageEl.setAttribute("alt", parkInfo.data[0].images[0].altText);
};

gbBtnEl.addEventListener('click', function () {
    parkInfoContain.className = "nationalParkContainer hidden";
    parkFormContain.className = "parkFormContainer";
});

visitBtnEl.addEventListener('click', function() {
    parkInfoContain.className = "nationalParkContainer hidden";
    visitorPageContain.className = "visitorInfoContainer";
});

activityBtnEl.addEventListener('click', function() {
    parkInfoContain.className = "nationalParkContainer hidden";
    activityPageContain.className = "bestHikesContainer";
});

submitBtn.addEventListener('click', submitBtnClickEvent);
activityBtnEl.addEventListener('click', thingsToDoClickEvent);

//end parkpage script
