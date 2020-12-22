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

function setLatAndLong(lat, long) {
    document.getElementById("latSpan").innerText = lat;
    document.getElementById("longSpan").innerText = long;
}

function onPositionFound(positionObj) {

    // assign co-ordinates from browser position
    var lat = positionObj.coords.latitude;
    var long = positionObj.coords.longitude;

    // call OpenWeather API using ajax
    $.ajax({
        url: assembleURL(apiUrlBase, lat, long, apikey),
        success: function(result){
            handleApiResponseData(result);
            setLatAndLong(lat, long);
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


// BEGIN CHART
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
				backgroundColor: '#fff89c',
				borderColor: '#EBDB00',
				data: dataSet
			}]
		},

		// Hourly Chart Config below
		options: {
            maintainAspectRatio: false,
            legend: {
                display: false
            },
            scales: {
                xAxes: [{
                    gridLines: {
                        display:false
                    }
                }],
                yAxes: [{
                    gridLines: {
                        display:false
                    },
                    ticks: {
                        suggestedMin: 30,
                        suggestedMax: 100
                    }   
                }]
            }
            // ,
            // layout: {
            //     padding: {
            //         top: 75,
            //         bottom: 75
            //     }
            // }
        }
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
        var tempsContainer = document.createElement("div");
        tempsContainer.className = "temps-container";

        // get unix time and display as DOW
        var dayOfWeek = moment.unix(dp.dt).format('dddd');
        dayOfWeek = dayOfWeek.substr(0,3);
        
        // create p tag; put DOW inside
        var dowP = document.createElement("p");
        dowP.style.margin = 0;
        dowP.innerText = dayOfWeek;

        // max and min temps
        // create p tags; put data inside
        var low = document.createElement("p");
        var high = document.createElement("p");
        high.innerText = Math.round(dp.temp.max);
        low.innerText = Math.round(dp.temp.min);
        tempsContainer.append(high, low);

        // create image tag and assign its source to icon URL
        var iconImage = document.createElement("img");
        iconImage.style.width = "5em";
        iconImage.src = iconBaseUrl + dp.weather[0].icon + "@2x.png";

        outer.append(dowP);
        outer.append(iconImage);
        outer.append(tempsContainer);

        main.append(outer);
    });
};
// END CHART

function handleCurrentWeatherData(crtWeatherObj) {
    console.log("I'm Current!", crtWeatherObj);
    // grab container from DOM and store in variable
    var main = document.getElementById("crtWeatherContainer");

    // current weather description
    var description = crtWeatherObj.weather[0].description;
    var descP = document.getElementById("descSpan");
    descP.innerText = description;

    var feels = Math.round(crtWeatherObj.feels_like);
    var feelsP = document.getElementById("feelsSpan");
    feelsP.innerText = feels + "°";

    var windSpeed = crtWeatherObj.wind_speed;
    console.log(typeof(windSpeed));
    var windP = document.getElementById("windSpan");
    windP.innerText = windSpeed + "mph";

    var temp = Math.round(crtWeatherObj.temp);
    var tempP = document.getElementById("tempSpan");
    tempP.innerText = temp + "°";

    var cTime = moment.unix(crtWeatherObj.dt).format('dddd, MMMM Do YYYY, h:mm:ss a');
    var cTimeSpan = document.getElementById("crntTimeSpan");
    cTimeSpan.innerText = cTime;

    // weather icon
    var iconImg = document.createElement("img");
    iconImg.src = iconBaseUrl + crtWeatherObj.weather[0].icon + "@2x.png";
    main.append(iconImg);

    var dowPlusTime = moment.unix(crtWeatherObj.dt).format('dddd, h:mm:ss a');
    var timeP = document.createElement("p");
    timeP.innerText = dowPlusTime;
}

navigator.geolocation.getCurrentPosition(onPositionFound, onPositionNotFound);

