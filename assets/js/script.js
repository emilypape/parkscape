// set up necessary variables

var parkSelectionInput = document.querySelector('#park-selection');
var submitBtn = document.querySelector('#submit-btn');

var activityBtn = document.querySelector('#activity-btn');
var hikeList = document.querySelector('#dynamic-hike-list');
var bucketlistPage = document.querySelector('#bucketlist-container');
var parkForm = document.querySelector('#park-form-container');
var vistorInfoPage = document.querySelector('#visitor-info-container');
var bestHikesPage = document.querySelector('#best-hikes-container');
var goBackBtnHP = document.querySelector('#go-back-btn');
var bucketlistBtn = document.querySelector('#bucketlist');
var bucketlistHikesContainer = document.querySelector('#hike-bucketlist-todo');
var learnMoreNavEl = document.querySelector('#learn-more');
var learnMorePage = document.querySelector('#learn-more-page');
var modalDisplay = document.querySelector('#modal-el');
var closeModal = document.querySelector('#close-modal');

let parkInfoContain = document.querySelector("#national-park-container");
let gbBtnEl = document.querySelector("#gb-btn");
let visitBtnEl = document.querySelector("#visitor-btn");

let homePageBtn = document.querySelector("#homepage");
let parkSelectionEl = document.querySelector('#parks-selection');

// end global variables

// get time values
var currentDay = moment();
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

let fetchParkNames = function() {
    let parkNameApi = 'https://developer.nps.gov/api/v1/parks?api_key=2JLCuHgadecfJrBe7FWSG7jOky4xF2fjg5Q5O458';

    fetch(parkNameApi).then(function(response) {
        if (response.ok) {
            response.json().then(function(data) {
                for (let i = 0 ; i < data.data.length ; i++) {
                    let optionCreateEl = document.createElement('option');
                    optionCreateEl.setAttribute('value', data.data[i].parkCode);
                    optionCreateEl.innerText = data.data[i].name + " (" + data.data[i].states + ")";
                    parkSelectionEl.appendChild(optionCreateEl);
                }
            });
        }
    });
};

// function to set selected hikes to local storage
function addToBucketlist() {
    modalDisplay.classList.remove('hidden');
    // set hikes to local storage when clicked
    var hike = this.textContent;
    var selectedHikes = localStorage.getItem('hikes')

    if(!selectedHikes) {
        selectedHikes = JSON.stringify([hike]);
    } else {
        selectedHikes = JSON.parse(selectedHikes);
        selectedHikes.push(hike);
        selectedHikes = JSON.stringify(selectedHikes);
    }
    localStorage.setItem('hikes', selectedHikes);
}

function attachToBucketlist () {
    var getBucketlist = localStorage.getItem('hikes')
    getBucketlist = JSON.parse(getBucketlist);
    var addBucketlist = document.createElement('ul')
    bucketlistHikesContainer.appendChild(addBucketlist);

    
    for(var i = 0; i < getBucketlist.length; i++) {
        var bucketlistItems = document.createElement('li');
        bucketlistItems.classList.add('hikesTodoList');
        bucketlistItems.id = 'bucketlist-items'
        bucketlistItems.textContent = getBucketlist[i];

        var deleteBtnEl = document.createElement('button');
        deleteBtnEl.classList.add('deleteBtnEl');
        deleteBtnEl.textContent = 'Delete'
        deleteBtnEl.addEventListener('click', deleteFromBucketlist)

        addBucketlist.appendChild(bucketlistItems);
        bucketlistItems.appendChild(deleteBtnEl);
    }
}

jQuery.fn.justtext = function() {
  
	return $(this)	.clone()
			.children()
			.remove()
			.end()
			.text();

};

function deleteFromBucketlist () {
    var parentContainer = $(this).closest('#bucketlist-items');
    var itemToDelete = parentContainer.justtext();
    parentContainer.remove();
    // get local storage
    var selectedItemsArray = localStorage.getItem('hikes');

    // turn local storage into an array
    selectedItemsArray = JSON.parse(selectedItemsArray)
    // rmove item from array
    var index = selectedItemsArray.indexOf(itemToDelete)
    if (index > -1) {
        selectedItemsArray.splice(index, 1);
    }
    // turn array into JSON string
    selectedItemsArray = JSON.stringify(selectedItemsArray);
    // save new JSON in local storage
    localStorage.setItem('hikes', selectedItemsArray);
}

// PUT DRAG AND DROP FUNCTIONS HERE EMILY

//user input National park selection
var mainPageSubmit = function (parkCode) {
    var nationalParkApi = `https://developer.nps.gov/api/v1/parks?parkCode=${parkCode}&api_key=dXZ1UXqLPTZyKYJ7zQInqlAulIuLnYesbCyyDJFR`;
    fetch(nationalParkApi).then(function (response) {
        if (response.ok) {
            response.json().then(function (data) {
                const lat = data.data[0].latitude;
                const long = data.data[0].longitude;

                
                var L = window.L
                var mapEl = document.querySelector("#map");
                mapEl.style.height = "500px"
                mapEl.style.width = "600px"
                document.getElementById("mapbox").appendChild(mapEl)
                var map = L.map('map')
                
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
                map.setView([lat, long], 13);
            })

        } else {
            console.log("failed");
        }
    })

}

function thingsToDoFetch(parks) {
    var thingsToDoUrl = `https://developer.nps.gov/api/v1/thingstodo?parkCode=${parks}&api_key=${key}`

    fetch(thingsToDoUrl).then(function(response){
        if(response.ok){
            response.json().then(function(thingsToDoData){
                createHikePage(parks,thingsToDoData);
            })
        }
    })
}


// function to sort the data, grab hike info and append to page
function createHikePage (parks, activities) {
    var hikes = 0
    if (!activities.data.length) {
        let nActivitiesFound = document.createElement('button');
            nActivitiesFound.id = '#popular-hikes-btn';
            nActivitiesFound.textContent = "No Activities Reported";
            nActivitiesFound.addEventListener('click', goBackToParkPageClickEvent);
            hikeList.appendChild(nActivitiesFound);
            return
    }

    for(var i = 0; i < activities.data.length; i++ ) {
        if(hikes === 5 ) {
            return
        } 
        if(activities.data[i].activities[0].name.toLowerCase() === 'hiking' || 'backpacking' || 'stargazing' || 'recreation' || 'walking'){
            hikes++
            var popularHikes = document.createElement('button');
            popularHikes.id = '#popular-hikes-btn'
            popularHikes.textContent = activities.data[i].title
            popularHikes.classList.add('popularHikesBtn')
            hikeList.appendChild(popularHikes);
            popularHikes.addEventListener('click', addToBucketlist);
        }
    }
}

// Section for click event listener functions

// click event for the bucketlist navbar element- hides all other elements on site, and calls function to grab bucketlist items
function closeModalClickEvent() {
    modalDisplay.classList.add('hidden');
}

function learnMorePageClickEvent () {
    learnMorePage.classList.remove('hidden');
    parkForm.classList.add("hidden");
    bestHikesPage.classList.add("hidden");
    vistorInfoPage.classList.add("hidden");
    parkInfoContain.classList.add("hidden");
    bucketlistPage.classList.add('hidden');
}

function goBackToParkPageClickEvent () {
    bestHikesPage.classList.add('hidden')
    parkInfoContain.classList.remove('hidden');
}

function bucketlistClickEvent() {
    bucketlistPage.classList.remove("hidden");
    parkForm.classList.add("hidden");
    bestHikesPage.classList.add("hidden");
    vistorInfoPage.classList.add("hidden");
    parkInfoContain.classList.add("hidden");
    learnMorePage.classList.add('hidden');

    attachToBucketlist();
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
                visitorPageInfo(parkData);
                mainPageSubmit(parkData.data[0].parkCode);
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
    parkForm.className = "parkFormContainer hidden";
}




// event listener land
submitBtn.addEventListener('click', submitBtnClickEvent);
activityBtn.addEventListener('click', thingsToDoClickEvent);
bucketlistBtn.addEventListener("click", bucketlistClickEvent);
goBackBtnHP.addEventListener('click', goBackToParkPageClickEvent);
learnMoreNavEl.addEventListener('click', learnMorePageClickEvent);
closeModal.addEventListener('click', closeModalClickEvent);


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
    location.reload();
});

visitBtnEl.addEventListener('click', function() {
    parkInfoContain.className = "nationalParkContainer hidden";
    vistorInfoPage.className = "visitorInfoContainer";
});


activityBtn.addEventListener('click', function() {
    parkInfoContain.className = "nationalParkContainer hidden";
    bestHikesPage.className = "bestHikesContainer";
});

homePageBtn.addEventListener('click', function () {
    location.reload();
})
submitBtn.addEventListener('click', submitBtnClickEvent);
activityBtn.addEventListener('click', thingsToDoClickEvent);

let visitorPageInfo = function (pData) {
    let pdata =  pData.data[0];
   
   let pHoursInfoEl = document.querySelector("#park-hours");
   let oHours = pdata.operatingHours[0].standardHours;
   pHoursInfoEl.innerText = "Park Hours:\n" + "Monday: " + oHours.monday + '\n' + "Tuesday: " + oHours.tuesday + '\n' + "Wednesday: " + oHours.wednesday + '\n' + "Thursday: " + oHours.thursday + '\n' + "Friday: " + oHours.friday + '\n' + "Saturday: " + oHours.saturday + '\n' + "Sunday: " + oHours.sunday + '\n';

//    let hHoursEl = document.querySelector('#holiday-hours');
//    hHoursEl.innerText = "";

    let cUsInfoEl = document.querySelector('#contact-us');
    cUsInfoEl.innerText = "Contact Us:\n" + "Phone: " + pdata.contacts.phoneNumbers[0].phoneNumber + '\nEmail: ' + pdata.contacts.emailAddresses[0].emailAddress + '\n';

}

//end parkpage script

fetchParkNames();