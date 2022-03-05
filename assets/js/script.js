
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





//user input National park selection
var submitBtn = function () {
    var parkSelect = document.getElementById("parkSelection")
  console.log(fromEl.value)
  console.log(toEl.value)
  console.log(parkSelect.value)

  document.getElementById("map").remove()
    var parkCode = parkSelect.options[parkSelect.selectedIndex].value
    var nationalParkApi = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=dXZ1UXqLPTZyKYJ7zQInqlAulIuLnYesbCyyDJFR`;
    fetch(nationalParkApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                console.log(data);
                const lat =data.data[0].latitude;
                const long = data.data[0].longitude;
                var weatherApi = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=89de62b6d12dc85d6af194716b54e779`;

                fetch(weatherApi).then(function (response) {
                    if (response.ok) {
                        response.json().then(function (data) {
                            console.log(data);
                        })
                    }
                })
                
                var L = window.L
               var mapEl= document.createElement("section")
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
        }
    })
}

document.getElementById("submit-btn").addEventListener("click", submitBtn)


