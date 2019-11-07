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
                
                if(status === 'OK'){
                    directionsRenderer.setDirections(result);
                    console.log(result);
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
            console.log(data);

           // <img alt="" src="data:image/svg+xml,%3Csvg%20version%3D%221.1%22%20width%3D%2227px%22%20height%3D%2243px%22%20viewBox%3D%220%200%2027%2043%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20xmlns%3Axlink%3D%22http%3A%2F%2Fwww.w3.org%2F1999%2Fxlink%22%3E%0A%3Cdefs%3E%0A%3Cpath%20id%3D%22a%22%20d%3D%22m12.5%200c-6.9039%200-12.5%205.5961-12.5%2012.5%200%201.8859%200.54297%203.7461%201.4414%205.4617%203.425%206.6156%2010.216%2013.566%2010.216%2022.195%200%200.46562%200.37734%200.84297%200.84297%200.84297s0.84297-0.37734%200.84297-0.84297c0-8.6289%206.7906-15.58%2010.216-22.195%200.89844-1.7156%201.4414-3.5758%201.4414-5.4617%200-6.9039-5.5961-12.5-12.5-12.5z%22%2F%3E%0A%3C%2Fdefs%3E%0A%3Cg%20fill%3D%22none%22%20fill-rule%3D%22evenodd%22%3E%0A%3Cg%20transform%3D%22translate(1%201)%22%3E%0A%3Cuse%20fill%3D%22%23EA4335%22%20fill-rule%3D%22evenodd%22%20xlink%3Ahref%3D%22%23a%22%2F%3E%0A%3Cpath%20d%3D%22m12.5-0.5c7.18%200%2013%205.82%2013%2013%200%201.8995-0.52398%203.8328-1.4974%205.6916-0.91575%201.7688-1.0177%201.9307-4.169%206.7789-4.2579%206.5508-5.9907%2010.447-5.9907%2015.187%200%200.74177-0.6012%201.343-1.343%201.343s-1.343-0.6012-1.343-1.343c0-4.7396-1.7327-8.6358-5.9907-15.187-3.1512-4.8482-3.2532-5.01-4.1679-6.7768-0.97449-1.8608-1.4985-3.7942-1.4985-5.6937%200-7.18%205.82-13%2013-13z%22%20stroke%3D%22%23fff%22%2F%3E%0A%3C%2Fg%3E%0A%3Ctext%20text-anchor%3D%22middle%22%20dy%3D%220.3em%22%20x%3D%2214%22%20y%3D%2215%22%20font-family%3D%22Roboto%2C%20Arial%2C%20sans-serif%22%20font-size%3D%2216px%22%20fill%3D%22%23FFF%22%3EA%3C%2Ftext%3E%0A%3C%2Fg%3E%0A%3C%2Fsvg%3E%0A" draggable="false" usemap="#gmimap0" style="position: absolute; left: 0px; top: 0px; width: 27px; height: 43px; user-select: none; border: 0px; padding: 0px; margin: 0px; max-width: none;"></img>
            let startAddressDiv = $("<div>").attr("id","startAddress").addClass("p-1")
                                        .append($("<img>").addClass("locIcon").attr("src","./assets/images/A.png"),
                                                $("<div>").addClass("route-address p-1").text(trimAddress(data.addresses.start)));
            
            let stepsDiv = $("<div>").attr("id","steps");
            console.log(data.stepsArr);
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


     

    

