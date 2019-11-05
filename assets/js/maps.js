var apiKey = "AIzaSyDQPvq_u4sl2uDIIrqwih_kzAb-Y9Ib7sw"
var map;  
var directionsService;
var directionsRenderer;
var MapsAPI = {};

//create script tag to load google maps API
var scriptTag = document.createElement("script");

var url = "https://maps.googleapis.com/maps/api/js?key="+apiKey;

LoaderJS.urls = [url];
LoaderJS.callbacks = [resolve];
LoaderJS.locations = [scriptTag];
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
                    console.log(resultsForDirectionsPanel);
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
            console.log(routeStatsDiv);
            let startAddressDiv = $("<div>").attr("id","startAddress").text(data.start);
            let stepsDiv = $("<div>").attr("id","steps");
            data.stepsArr.forEach(element => {

            });
            let endAddressDiv = $("<div>").attr("id","startAddress").text(data.start);
            let copyrightDiv = $("<div>").attr("id","copyright").text(data.copyright);

            $(divToAttach).append(warningsDiv,routeStatsDiv,startAddressDiv, stepsDiv, endAddressDiv,copyrightDiv);

        }
    
    
        return {
            initMap: function(address,jobLocation,mapElement, directionsElement) {
                
                if(map == null){
                    map = new google.maps.Map(mapElement, {
                        // center: {lat: 43.710801, lng: -79.392507},
                        // zoom: 11
                    });
                    directionsRenderer.setMap(map);
                }
                
                addRoute(address,jobLocation.CompanyName+" "+jobLocation.city, directionsElement);

                
                //directionsRenderer.setPanel(directionsElement);
                         
                
            }
        }        
    }();

}


     

    

