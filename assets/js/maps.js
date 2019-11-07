var apiKey = "AIzaSyDQPvq_u4sl2uDIIrqwih_kzAb-Y9Ib7sw"
var map;  
var directionsService;
var directionsRenderer;
var MapsAPI = {};
var placesService;

//create script tag to load google maps API
var googleMapsScriptTag = document.createElement("script");

var url = "https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/js?key="+apiKey+"&libraries=places";

//Loader JS - loads the contents of an external script into a script tag
LoaderJS.urls = [url];
LoaderJS.callbacks = [resolve];
LoaderJS.locations = [googleMapsScriptTag];
LoaderJS.loadUrls();
   

function resolve(){
    
    directionsService = new google.maps.DirectionsService();
    directionsRenderer = new google.maps.DirectionsRenderer();   

    MapsAPI = function(){   

        //gets a moment for the next work day at 9am Used for arrival time.
        function getNextWorkDay(){        
            var tomorrow = moment().add(1, 'days');
            //if saturday or sunday
            if(tomorrow.day() === 6 || tomorrow.day() === 0){
                
                return (moment().day(1).hour(9).minutes(0).seconds(0)).unix();
                
            }else{
                
                return (tomorrow.hour(9).minutes(0).seconds(0)).unix();
            }
        
        }
        //Removes the Province and postal code from results for better formatting.
        function trimAddress(address){
            let addr = address.split(",");
            let result = [];
            for (let i = 0; i < addr.length;i++){
                addr[i] = addr[i].trim();
                if(i < addr.length - 2){
                    result.push(addr[i]);
                }
            }
            return result.join(", ");
            
        } 

        function addRoute(origin,destination,directionsElement){
            
            var request = {
                origin: origin,
                destination: destination,
                travelMode: "TRANSIT",
                transitOptions: {arrivalTime: new Date(getNextWorkDay()*1000)}
            };
            directionsService.route(request, function(result, status){
                console.log(status);
                if(status === 'OK'){
                    directionsRenderer.setDirections(result);
                    console.log(result);
                    //sift through our resluts to get the releveant data
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
                warningsDiv.append($("<div>").addClass("warningEntry p-1").text(element));
            });
            let routeStatsDiv = $("<div>").attr("id","routeStats").addClass("p-1");
            routeStatsDiv.append($("<div>").text(moment(data.stats.departureTime).format("h:mm A") + " - " + moment(data.stats.arrivalTime).format("h:mm A")).addClass("routeText font-weight-bold"),
                              $("<div>").text("("+data.stats.duration+")").addClass("routeText duration"),
                              $("<div>").text(data.stats.distance).addClass("routeText")  
            );

            let startAddressDiv = $("<div>").attr("id","startAddress").addClass("p-1")
                                        .append($("<img>").addClass("locIcon").attr("src","./assets/images/A.png"),
                                                $("<div>").addClass("route-address p-1").text(trimAddress(data.addresses.start)));
            
            let stepsDiv = $("<div>").attr("id","steps");
           
            data.stepsArr.forEach(element => {                
                stepsDiv.append($("<div>").addClass("step p-1 mx-1 mb-1")
                            .append($("<img>").attr("src",getTravelMode(element)).addClass("transitIcon"),
                                    getTransitStyle(element),
                                    $("<div>").text(element.distance.text).addClass("distance"),
                                    $("<div>").text("("+element.duration.text+")").addClass("duration"),
                                    $("<div>").addClass("instructions").text(element.instructions)
                            ));
            });         
            
            let endAddressDiv = $("<div>").attr("id","endAddress").addClass("p-1")
                            .append($("<img>").addClass("locIcon").attr("src","./assets/images/B.png"),
                                    $("<div>").addClass("route-address p-1").text(trimAddress(data.addresses.end)));
            let copyrightDiv = $("<div>").attr("id","copyright").addClass("p-1").text(data.copyright);

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
                             .css("color",step.transit.line.text_color)
                             .addClass("transit");

        }

        function getGeocodeForJob(addr,locationObj,directionsElement){
            
            var request;
            console.log(locationObj);
            //check to see if we don't have coords but do have a company and city
            if((locationObj.Lat == undefined || locationObj.Long == undefined) && locationObj.CompanyName != null && locationObj.City != null){
                request = {
                    query: locationObj.CompanyName + " "+locationObj.City,
                    fields: ['geometry']                    
                  };
            //we have a latlng      
            }else if (locationObj.Lat != null && locationObj.Long != null){
                request = {
                    query: locationObj.CompanyName + " "+locationObj.City,
                    fields: ['geometry'],
                    locationBias: {radius: 200, center: {lat: locationObj.Lat, lng: locationObj.Long}}
                  };
            //we have nothing so load the default map and return.    
            }else{
                console.log("No Location Data");
                map.setCenter( {lat: 43.710801, lng: -79.392507}); 
                map.setZoom(11);                   
                
                $(directionsElement).empty();
                $(directionsElement).html("<h6>Directions for this Job Posting could not be found</h6>");
                return
            }
            
           placesService.findPlaceFromQuery(request, function(results, status){
                console.log("geocode request: ",request);
                console.log("geocode status: ", status);
                if (status === google.maps.places.PlacesServiceStatus.OK){
                   
                    addRoute(addr, {lat: results[0].geometry.location.lat(), lng: results[0].geometry.location.lng()},directionsElement);
                //if no results but there is a latlng, just use that.
                }else if(status === "ZERO_RESULTS" && (locationObj.Lat != null)) {
                    addRoute(addr,{lat: locationObj.Lat,lng: locationObj.Long},directionsElement);
                }else{
                    //set to center on toronto, display message
                    map.setCenter( {lat: 43.710801, lng: -79.392507}); 
                    map.setZoom(11);                   
                    
                    $(directionsElement).empty();
                    $(directionsElement).html("<h6>Directions for this Job Posting could not be found</h6>");
                }
           });   

        }
    
        return {
            initMap: function(address,jobLocation,mapElement, directionsElement) {
                
               
                // if(map == null){
                //     map = new google.maps.Map(mapElement, {
                //         center: {lat: 43.710801, lng: -79.392507},
                //         zoom: 11
                //     });
                    
                // }
                map = new google.maps.Map(mapElement, {
                    mapTypeControl: false
                    // center: {lat: 43.710801, lng: -79.392507},
                    // zoom: 11
                });                
                google.maps.event.trigger(map, 'resize');
                directionsRenderer.setMap(map);
                placesService = new google.maps.places.PlacesService(map);
                getGeocodeForJob(address,jobLocation,directionsElement); 
               // directionsRenderer.setPanel(directionsElement);
                         
                
            }
        }        
    }();

}


     

    

