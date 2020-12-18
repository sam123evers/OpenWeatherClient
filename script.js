var apikey = '79a00d357f87a1ac91275e55183d49d2';
var apiurl = 'http://api.openweathermap.org/data/2.5/forecast?id=524901&appid=';

// make ajax call to open weather api
$.ajax({
    url: apiurl + apikey,
    success: function(result, status, xhr){
        console.log(result);
        console.log(status);
        console.log(xhr)
    }
});

// consume / map data how you want it

// plug data into graphs show icons etc