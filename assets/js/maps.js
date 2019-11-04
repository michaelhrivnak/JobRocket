var apiKey = "AIzaSyDQPvq_u4sl2uDIIrqwih_kzAb-Y9Ib7sw"
var map;  
var directionsService;
var directionsRenderer;
var MapsAPI = {};

//create script tag to load google maps API
var script = document.createElement("script");
script.src = "https://maps.googleapis.com/maps/api/js?key="+apiKey+"&callback=resolve";
$("body").append(script);    

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
          
        function addRoute(origin,destination){
            
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
                        warnings: result.routes[0].warnings,
                        steps: result.routes[0].legs[0].steps,
                        stats:{
                            arrivalTime: result.routes[0].legs[0].arrival_time.value,
                            departureTime: result.routes[0].legs[0].depature_time.value,
                            distance: result.routes[0].legs[0].distance.text,
                            duration: result.routes[0].legs[0].duration.text
                        },
                        addresses:{
                            start: results.routes[0].legs[0].start_address,
                            end: results.routes[0].legs[0].end_address
                        },
                        copyright: results.routes[0].copyrights
                    };
                    setPanel(resultsForDirectionsPanel);
                }
                 
            }); 
           
        }

        function setPanel(data){

        }
    
    
        return {
            initMap: function(address,jobLocation) {
                
                map = new google.maps.Map(document.getElementById('map'), {
                    center: {lat: 43.710801, lng: -79.392507},
                    zoom: 11
                });
    
                directionsRenderer.setMap(map);
                
                addRoute(address,jobLocation.CompanyName+" "+jobLocation.city);

                
                //directionsRenderer.setPanel(document.getElementById('directionsPanel'));
                         
                
            }
        }        
    }();

}


     

    

