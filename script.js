var apikey = '79a00d357f87a1ac91275e55183d49d2';
var apiUrlBase = 'https://api.openweathermap.org/data/2.5/onecall';
var urlWithParams;
var apiResponse;


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

    // we assume to have found the position here,
    // so we're not checking for it


    // make ajax call to open weather api
    $.ajax({
        url: assembleURL(apiUrlBase, lat, long, apikey),
        success: function(result){
            handleApiResponseData(result);
        }
    });
};

function onPositionNotFound() {
    alert("Because we cannot locate you, \nthis app will not work so well \n:-(\nConsider allowing your location\n:+)");
};


function handleApiResponseData(weatherData) {
    var current = weatherData.current;
    var minutely = weatherData.minutely;
    var hourlyWeatherData = weatherData.hourly;
    var daily = weatherData.daily;

    handleHourlyWeatherData(hourlyWeatherData);
}   

function handleHourlyWeatherData(hoursData) {
    var labels = [];
    var dataSet = [];
    hoursData.forEach((dp, i) => {
        //console.log(dp);
        if(i % 3 === 0 && i < 24) {
            var readableTime = moment.unix(dp.dt).format('h:mm A'); 
            labels.push(readableTime);
            dataSet.push(dp.temp);
        }
    });


    var ctx = document.getElementById('hourlyWeatherCanvas').getContext('2d');

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

		// Configuration options go here
		options: {}
	});
}

navigator.geolocation.getCurrentPosition(onPositionFound, onPositionNotFound);

