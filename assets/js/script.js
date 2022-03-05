var parkSelectionInput = document.querySelector('#park-selection');
var submitBtn = document.querySelector('#submit-btn');
var activityBtn = document.querySelector('#activity-btn');
var hikeList = document.querySelector('#dynamic-hike-list');

// api key for the project
var key = '2JLCuHgadecfJrBe7FWSG7jOky4xF2fjg5Q5O458';

// function to set selected hikes to local storage
function addToBucketlist() {
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

// function that fetchest the national park API with necessary parameters
function nationalParkFetch (parks) {
    // park code will accept the typed in park name as the code, already checked
    var NatParkUrl = `https://developer.nps.gov/api/v1/parks?parkCode=${parks}&api_key=${key}`
    // park name and info that goes along with park parameter fetch
    fetch(NatParkUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(parkData) {
                console.log(parkData);
            })
        } 
    })
}

// fetch with things to do end point for the hiking section
function thingsToDoFetch (parks) {
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
    for(var i = 0; i < activities.data.length; i++ ) {
        if(hikes === 5 ) {
            return
        }
        if(activities.data[i].activities[0].name.toLowerCase() === 'hiking'){
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

// click listener function for the best hikes section
function thingsToDoClickEvent(){
    var parks = parkSelectionInput.value 
    thingsToDoFetch(parks);
}

// click event function for park selection to keep fetch function pure for further use
// this function can also house the information for dates
// ***!!!JULIE!!!*** grab date info here, this is for the submit button!
function submitBtnClickEvent (e) {
    // I styled the html in a form, so this keeps the page from auto refreshing
    e.preventDefault();
    // capture the input for park selection
    var parks = parkSelectionInput.value;
    console.log(parkSelectionInput.value);
    // call the function with the info fetch with the argument 'parks' which is the input value
    nationalParkFetch(parks);
}


submitBtn.addEventListener('click', submitBtnClickEvent);
activityBtn.addEventListener('click', thingsToDoClickEvent);

