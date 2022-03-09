var currentDay = moment()
var fromValue = moment().format('YYYY-MM-DD')
currentDay.add(1, "day")
var toValue = currentDay.format("YYYY-MM-DD")
currentDay.add(6, "day")
var maxValue = currentDay.format("YYYY-MM-DD")
currentDay.add(1, "day")
var toMaxValue = currentDay.format("YYYY-MM-DD")
var parkSelectionInput = document.querySelector('#park-selection');
var submitBtn = document.querySelector('#submit-btn');
var activityBtn = document.querySelector('#activity-btn');

var fromEl = document.getElementById("from")

fromEl.setAttribute("value", fromValue)

fromEl.setAttribute("max", maxValue)
var toEl = document.getElementById("to")

toEl.setAttribute("value", toValue)

toEl.setAttribute("max", toMaxValue)

toEl.setAttribute("min", toValue)
fromEl.setAttribute("min", fromValue)
var key = '2JLCuHgadecfJrBe7FWSG7jOky4xF2fjg5Q5O458';





//user input National park selection
var mainPageSubmit= function () {
    var parkSelect = document.getElementById("park-selection")
    

    document.getElementById("map").remove()
    var parkCode = parkSelect.options[parkSelect.selectedIndex].value
    var nationalParkApi = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=dXZ1UXqLPTZyKYJ7zQInqlAulIuLnYesbCyyDJFR`;
    fetch(nationalParkApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                const lat = data.data[0].latitude;
                const long = data.data[0].longitude;


                var L = window.L
                var mapEl = document.createElement("section")
                mapEl.setAttribute("id", "map")
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
                console.log(parkData);
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
    console.log(parkSelectionInput.value);
    // call the function with the info fetch with the argument 'parks' which is the input value
    nationalParkFetch(parks);
    mainPageSubmit();
}

submitBtn.addEventListener('click', submitBtnClickEvent);
activityBtn.addEventListener('click', thingsToDoClickEvent);
