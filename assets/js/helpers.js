//requies moment and jquery

function getDayOfWeek(date){
    return moment.unix(parseInt(date)).format('dddd');
}

//capitalizes the first leter of each word (does not work with non word charactesr like apostrophe)
String.prototype.properNoun = function (str){
     return str.toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
}

function getLocalStorage(key){
    return JSON.parse(localStorage.getItem(key));
}

function saveLocalStorage(key, value){
    localStorage.setItem(key,JSON.stringify(value));
}

function performAPIGETCall(queryURL, callbackFunction){    
    $.ajax({url: queryURL, method: "GET"}).then(function(response){
        callbackFunction(response);
    });   
}

function testFunction(mFunction,...args){   
    console.log(mFunction(...args));
}