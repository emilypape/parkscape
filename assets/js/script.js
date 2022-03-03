var parkSelectionInput = document.querySelector('#park-selection');
var submitBtn = document.querySelector('#submit-btn');
var key = '2JLCuHgadecfJrBe7FWSG7jOky4xF2fjg5Q5O458';

// function that fetchest the national park API with necessary parameters
function nationalParkFetch (parks) {
    var NatParkUrl = `https://developer.nps.gov/api/v1/activities?parkName=${parks}&api_key=${key}`
    fetch(NatParkUrl).then(function(response){
        if(response.ok) {
            response.json().then(function(parkData) {
                console.log(parkData);
            })
        }
    })
}

// click event function for park selection to keep fetch function pure for further use
// this function can also house the information for dates
// ***!!!JULIE!!!*** grab date info here, this is for the submit button!
function submitBtnClickEvent (e) {
    e.preventDefault();

    var parks = parkSelectionInput.value;
    console.log(parkSelectionInput.value);
    nationalParkFetch(parks);
}

submitBtn.addEventListener('click', submitBtnClickEvent);