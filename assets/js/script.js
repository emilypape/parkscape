






//user input National park selection
var submitBtn = function () {
    var parkSelect = document.getElementById("parkSelection")

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
                var map = L.map('map').setView([51.505, -0.09], 13);
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