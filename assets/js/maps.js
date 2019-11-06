var apiKey = "AIzaSyDQPvq_u4sl2uDIIrqwih_kzAb-Y9Ib7sw"
var map;  
var directionsService;
var directionsRenderer;
var MapsAPI = {};
var placesService;

//create script tag to load google maps API
var googleMapsScriptTag = document.createElement("script");
//var placesScriptTag = document.createElement("script");
var url = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key="+apiKey+"&libraries=places";
//var placesUrl = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key="+apiKey+"&libraries=places"
LoaderJS.urls = [url];
LoaderJS.callbacks = [resolve];
LoaderJS.locations = [googleMapsScriptTag];
LoaderJS.loadUrls();

// script.src = "https://maps.googleapis.com/maps/api/js?key="+apiKey+"&callback=resolve";
// script.type ="text/javascript";
// $("body").append(script);    

function resolve(){
    
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();   

    MapsAPI = function(){   

        function getNextWorkDay(){        
            var tomorrow = moment().add(1, 'days');
            //if saturday or sunday
            if(tomorrow.day() === 6 || tomorrow.day() === 0){
                
                return (moment().day(1).hour(9).minutes(0).seconds(0)).unix();
                
            }else{
                
                return (tomorrow.hour(9).minutes(0).seconds(0)).unix();
            }
        
        }
          
        function addRoute(origin,destination,directionsElement){
            
            var request = {
                origin: origin,
                destination: destination,
                travelMode: "TRANSIT",
                transitOptions: {arrivalTime: new Date(getNextWorkDay()*1000)}
            };
            directionsService.route(request, function(result, status){
                
                if(status === 'OK'){
                    directionsRenderer.setDirections(result);
                    
                    let resultsForDirectionsPanel = {
                        warningsArr: result.routes[0].warnings,
                        stepsArr: result.routes[0].legs[0].steps,
                        stats:{
                            arrivalTime: result.routes[0].legs[0].arrival_time.value,
                            departureTime: result.routes[0].legs[0].departure_time.value,
                            distance: result.routes[0].legs[0].distance.text,
                            duration: result.routes[0].legs[0].duration.text
                        },
                        addresses:{
                            start: result.routes[0].legs[0].start_address,
                            end: result.routes[0].legs[0].end_address
                        },
                        copyright: result.routes[0].copyrights
                    };
                    
                    setPanel(resultsForDirectionsPanel, directionsElement);
                }
                 
            }); 
           
        }
        //TODO: format the route data to be more compact (fit into the height of the map itself)
        function setPanel(data, divToAttach){
            $(divToAttach).empty();
            let warningsDiv = $("<div>").attr("id","warnings");
            data.warningsArr.forEach(element => {
                warningsDiv.append($("<div>").addClass("warningEntry").text(element));
            });
            let routeStatsDiv = $("<div>").attr("id","routeStats");
            routeStatsDiv.append($("<div>").text(moment(data.stats.departureTime).format("h:mm A") + " - " + moment(data.stats.arrivalTime).format("h:mm A")).addClass("routeText"),
                              $("<div>").text("("+data.stats.duration+")").addClass("routeText"),
                              $("<div>").text(data.stats.distance).addClass("routeText")  
            );
            console.log(data);
            let startAddressDiv = $("<div>").attr("id","startAddress").text(data.addresses.start);
            
            let stepsDiv = $("<div>").attr("id","steps");
            console.log(data.stepsArr);
            data.stepsArr.forEach(element => {                
                stepsDiv.append($("<div>").addClass("step")
                            .append($("<img>").attr("src",getTravelMode(element)).addClass("transitIcon"),
                                    getTransitStyle(element),
                                    $("<div>").text(element.distance.text),
                                    $("<div>").text(element.duration.text),
                                    $("<div>").text(element.instructions)
                            ));
            });         
            
            let endAddressDiv = $("<div>").attr("id","startAddress").text(data.addresses.end);
            let copyrightDiv = $("<div>").attr("id","copyright").text(data.copyright);

            $(divToAttach).append(warningsDiv,routeStatsDiv,startAddressDiv, stepsDiv, endAddressDiv,copyrightDiv);

        }

        function getTravelMode(step){
            if (step.transit == undefined){
                return "https://maps.gstatic.com/mapfiles/transit/iw2/6/walk.png";
            }            
            return step.transit.line.vehicle.icon

        }

        function getTransitStyle(step){
            if (step.transit == undefined){
                return null;
            }
            return $("<div>").text(step.transit.line.short_name)
                             .css("backgroundColor",step.transit.line.color)
                             .css("color",step.transit.line.text_color);

        }

        function getGeocodeForJob(addr,locationObj,directionsElement){
            
            var request = {
                query: locationObj.CompanyName + " "+locationObj.city,
                fields: ['geometry'],
                locationBias: {radius: 200, center: {lat: locationObj.lat, lng: locationObj.lang}}
              };

           placesService.findPlaceFromQuery(request, function(results, status){
               if (status === google.maps.places.PlacesServiceStatus.OK){
                   
                addRoute(addr, {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()},directionsElement);
               }
           });   

        }
    
        return {
            initMap: function(address,jobLocation,mapElement, directionsElement) {
                
                if(map == null){
                    map = new google.maps.Map(mapElement, {
                        // center: {lat: 43.710801, lng: -79.392507},
                        // zoom: 11
                    });
                    
                }
                directionsRenderer.setMap(map);
                placesService = new google.maps.places.PlacesService(map);
                getGeocodeForJob(address,jobLocation,directionsElement); 
                //directionsRenderer.setPanel(directionsElement);
                         
                
            }
        }        
    }();

}


     

    

