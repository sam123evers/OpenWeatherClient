var apikey = '79a00d357f87a1ac91275e55183d49d2';
var apiUrlBase = 'https://api.openweathermap.org/data/2.5/onecall';
var urlWithParams;
var apiResponse;

var iconBaseUrl = "http://openweathermap.org/img/wn/";
// replace 10d with icon string and desired size after @;
// eg: "http://openweathermap.org/img/wn/10d@2x.png";



// define function that build the URL
function assembleURL(base, lat, long, key){

    const urlWithParams = new URL(base);

    urlWithParams.searchParams.append("lat", lat);
    urlWithParams.searchParams.append("lon", long);
    urlWithParams.searchParams.append("units", "imperial");
    urlWithParams.searchParams.append("appid", key);

    return urlWithParams.href;

};

function onPositionFound(positionObj) {

    // assign co-ordinates from browser position
    var lat = positionObj.coords.latitude;
    var long = positionObj.coords.longitude;

    // make ajax call to open weather api
    $.ajax({
        url: assembleURL(apiUrlBase, lat, long, apikey),
        success: function(result){
            handleApiResponseData(result);
        },
        error: function(err) {
            alert(err);
        }
    });
};

function onPositionNotFound() {
    alert("Because we cannot locate you, \nthis app will not work so well \n:-(\nConsider allowing your location\n:+)");
};


function handleApiResponseData(weatherData) {
    var minutely = weatherData.minutely;

    handleCurrentWeatherData(weatherData.current); 
    handleHourlyWeatherData(weatherData.hourly);
    handleDailyWeatherData(weatherData.daily);
}   

function handleHourlyWeatherData(hrsDataObj) {
    var labels = [];
    var dataSet = [];
    hrsDataObj.forEach((dp, i) => {
        //console.log(dp);
        if(i % 3 === 0 && i < 24) {
            var readableTime = moment.unix(dp.dt).format('h:mm A'); 
            labels.push(readableTime);
            dataSet.push(dp.temp);
        }
    });


    var ctx = document.getElementById('hourlyCanvas').getContext('2d');

	var chart = new Chart(ctx, {
		// The type of chart we want to create
		type: 'line',

		// The data for our dataset
		data: {
			labels: labels,
			datasets: [{
				label: 'Hourly Weather',
				backgroundColor: '#FFE168',
				borderColor: 'rgb(255, 99, 132)',
				data: dataSet
			}]
		},

		// Hourly Chart Config below
		options: {}
	});
}

function handleDailyWeatherData(dlyWeatherObj) {
    console.log("I'm daily!", dlyWeatherObj);

    dlyWeatherObj.map((dp) => {
        // grab container from DOM; store in variable
        var main = document.getElementById("dlyWeatherContainer");

        // create four divs
        var outer = document.createElement("div");
        outer.className = "daily-weather-cell";
        var dayContainer = document.createElement("div");
        var iconContainer = document.createElement("div");
        var tempContainer = document.createElement("div");

        // get unix time and display as DOW
        var dayOfWeek = moment.unix(dp.dt).format('dddd'); 

        // max and min temps
        // create p tags; put data inside
        var low = document.createElement("p");
        var high = document.createElement("p");
        high.innerText = dp.temp.max;
        low.innerText = dp.temp.min;
        tempContainer.append(high, low);

        // create image tag and assign its source to icon URL
        var iconImage = document.createElement("img");
        iconImage.src = iconBaseUrl + dp.weather[0].icon + ".png";

        // create p tag; put DOW inside
        var dowP = document.createElement("p");
        dowP.innerText = dayOfWeek;


        
        outer.append(dowP);
        outer.append(iconImage);
        outer.append(tempContainer);

        

        //console.log(dp.temp.max);
        //console.log(dp.temp.min);
        console.log(dp.weather[0].icon);
        console.log(dp.weather[0].description);

        main.append(outer);
    });
};

function handleCurrentWeatherData(crtWeatherObj) {
    console.log("I'm Current!", crtWeatherObj);
}

navigator.geolocation.getCurrentPosition(onPositionFound, onPositionNotFound);

