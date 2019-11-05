var map;
var marker;
var geoCoder;
var latLngC;
var defaultLat = "";
var defaultLng = "";

var mUpdateAddress = false;
var mUpdateLatitude = false;
var mUpdateLongitude = false;
var mUpdateDrag = false;

function initialize() {

    //$('.txtLatitude').val(defaultLat);
    //$('.txtLongitude').val(defaultLng);

    latLngC = new google.maps.LatLng(defaultLat, defaultLng);

    var mapOptions = {
        center: latLngC,
        zoom: 18,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    map = new google.maps.Map(document.getElementById('source_map'),
mapOptions);

    var marker = new google.maps.Marker({
        position: latLngC,
        map: map,
        draggable: true
    });

    google.maps.event.addListener(marker, 'dragend', function (x) {

        mUpdateDrag = true;
        mUpdateAddress = false;
        mUpdateLatitude = false;
        mUpdateLongitude = false;

        document.getElementById('src_lat').value = x.latLng.lat();
        document.getElementById('src_long').value = x.latLng.lng();
        //document.getElementById('pickup_location').innerHTML = x.latLng.lat() + ' , ' + x.latLng.lng();

        $('.txtLatitude').val(x.latLng.lat());
        $('.txtLongitude').val(x.latLng.lng());

        var geocoder = new google.maps.Geocoder;
        var infowindow = new google.maps.InfoWindow;
        geocodeLatLng(geocoder, map, infowindow, x.latLng.lat(), x.latLng.lng(), 'txtPropertyAddress');

        refreshValues();
    });

    ////Get coordinates,address Upon clicking a location in map (Source Map)
    //google.maps.event.addListener(map, 'click', function (x) {
    //    document.getElementById('src_lat').value = x.latLng.lat();
    //    document.getElementById('src_long').value = x.latLng.lng();
    //    //document.getElementById('pickup_location').innerHTML = x.latLng.lat() + ' , ' + x.latLng.lng();

    //    $('.txtLatitude').val(x.latLng.lat());
    //    $('.txtLongitude').val(x.latLng.lng());

    //    var geocoder = new google.maps.Geocoder;
    //    var infowindow = new google.maps.InfoWindow;
    //    geocodeLatLng(geocoder, map, infowindow, x.latLng.lat(), x.latLng.lng(), 'txtPropertyAddress');
    //});

    ////Add marker upon clicking on map
    ////google.maps.event.addDomListener(map, 'click', addMarker);
    //google.maps.event.addDomListener(map, 'click', function () { addMarker(map); });

    var places1 = new google.maps.places.Autocomplete(document.getElementById('txtPropertyAddress'));
    google.maps.event.addListener(places1, 'place_changed', function () {
        var place1 = places1.getPlace();

        var src_addr = place1.formatted_address;
        var src_lat = place1.geometry.location.lat();
        var src_long = place1.geometry.location.lng();

        var mesg1 = "Address: " + src_addr;
        mesg1 += "\nLatitude: " + src_lat;
        mesg1 += "\nLongitude: " + src_long;
        //alert(mesg1);

        document.getElementById('src_lat').value = src_lat;
        document.getElementById('src_long').value = src_long;
        //document.getElementById('pickup_location').innerHTML = src_lat + ' , ' + src_long;

        $('.txtLatitude').val(src_lat);
        $('.txtLongitude').val(src_long);
    });

    //Add marker upon place change
    //google.maps.event.addDomListener(places1, 'place_changed', addMarker);            
    google.maps.event.addDomListener(places1, 'place_changed', function () { addMarker(map); });

}

google.maps.event.addDomListener(window, 'resize', initialize);
google.maps.event.addDomListener(window, 'load', initialize);

//Function to add marker upon clicking on a location in map
function addMarker(map) {
    var lat = document.getElementById('src_lat').value;
    var loong = document.getElementById('src_long').value;
    if (!lat || !loong) return;

    var coordinate = new google.maps.LatLng(lat, loong);

    if (marker) {
        //if marker already was created change positon
        marker.setPosition(coordinate);
        map.setCenter(coordinate);
        map.setZoom(18);

        google.maps.event.addListener(marker, 'dragend', function (x) {

            mUpdateLatitude = false;
            mUpdateDrag = true;
            mUpdateAddress = false;
            mUpdateLongitude = false;

            document.getElementById('src_lat').value = x.latLng.lat();
            document.getElementById('src_long').value = x.latLng.lng();
            //document.getElementById('pickup_location').innerHTML = x.latLng.lat() + ' , ' + x.latLng.lng();

            $('.txtLatitude').val(x.latLng.lat());
            $('.txtLongitude').val(x.latLng.lng());

            var geocoder = new google.maps.Geocoder;
            var infowindow = new google.maps.InfoWindow;
            geocodeLatLng(geocoder, map, infowindow, x.latLng.lat(), x.latLng.lng(), 'txtPropertyAddress');

            refreshValues();
        });
    }
    else {
        //create a marker
        marker = new google.maps.Marker({
            position: coordinate,
            map: map,
            draggable: true
        });
        map.setCenter(coordinate);
        map.setZoom(18);

        google.maps.event.addListener(marker, 'dragend', function (x) {

            mUpdateLatitude = false;
            mUpdateDrag = true;
            mUpdateAddress = false;
            mUpdateLongitude = false;

            document.getElementById('src_lat').value = x.latLng.lat();
            document.getElementById('src_long').value = x.latLng.lng();
            //document.getElementById('pickup_location').innerHTML = x.latLng.lat() + ' , ' + x.latLng.lng();

            $('.txtLatitude').val(x.latLng.lat());
            $('.txtLongitude').val(x.latLng.lng());

            var geocoder = new google.maps.Geocoder;
            var infowindow = new google.maps.InfoWindow;
            geocodeLatLng(geocoder, map, infowindow, x.latLng.lat(), x.latLng.lng(), 'txtPropertyAddress');

            refreshValues();
        });
    }
}

function refreshValues() {
    mUpdateLatitude = false;
    mUpdateDrag = false;
    mUpdateAddress = false;
    mUpdateLongitude = false;
}

//To Calculate address from coordinates
function geocodeLatLng(geocoder, map, infowindow, latt, longg, addr_div) {
    var latlng = { lat: parseFloat(latt), lng: parseFloat(longg) };
    geocoder.geocode({ 'location': latlng }, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK) {

            if (results[1]) {
                //alert(results[1].formatted_address);

                document.getElementById(addr_div).value = results[1].formatted_address;

                //infowindow.setContent(results[1].formatted_address);
                //infowindow.open(map, marker);
            }
            else {
                window.alert('No results found');
            }
        }
        else {
            //window.alert('Geocoder failed due to: ' + status);
        }
    });
}

function updateLocation(lat, lng) {

    //// set default values
    //$('.txtLatitude').val(lat);
    //$('.txtLongitude').val(lng);

    //document.getElementById('src_lat').value = lat;
    //document.getElementById('src_long').value = lng;

    console.log(lat + ' - ' + lng);

    if ((lat.length > 0) && (lng.length > 0)) {

        latLngC = new google.maps.LatLng(lat, lng);

        var mapOptions = {
            center: latLngC,
            zoom: 18,
            mapTypeId: google.maps.MapTypeId.ROADMAP,
        };

        map = new google.maps.Map(document.getElementById('source_map'),
    mapOptions);

        var marker = new google.maps.Marker({
            position: latLngC,
            map: map,
            draggable: true
        });

        google.maps.event.addListener(marker, 'dragend', function (x) {

            mUpdateLatitude = false;
            mUpdateDrag = true;
            mUpdateAddress = false;
            mUpdateLongitude = false;

            document.getElementById('src_lat').value = x.latLng.lat();
            document.getElementById('src_long').value = x.latLng.lng();
            //document.getElementById('pickup_location').innerHTML = x.latLng.lat() + ' , ' + x.latLng.lng();

            $('.txtLatitude').val(x.latLng.lat());
            $('.txtLongitude').val(x.latLng.lng());

            var geocoder = new google.maps.Geocoder;
            var infowindow = new google.maps.InfoWindow;
            geocodeLatLng(geocoder, map, infowindow, x.latLng.lat(), x.latLng.lng(), 'txtPropertyAddress');

            refreshValues();
        });

        ////Get coordinates,address Upon clicking a location in map (Source Map)
        //google.maps.event.addListener(map, 'click', function (x) {
        //    document.getElementById('src_lat').value = x.latLng.lat();
        //    document.getElementById('src_long').value = x.latLng.lng();
        //    //document.getElementById('pickup_location').innerHTML = x.latLng.lat() + ' , ' + x.latLng.lng();

        //    $('.txtLatitude').val(x.latLng.lat());
        //    $('.txtLongitude').val(x.latLng.lng());

        //    var geocoder = new google.maps.Geocoder;
        //    var infowindow = new google.maps.InfoWindow;
        //    geocodeLatLng(geocoder, map, infowindow, x.latLng.lat(), x.latLng.lng(), 'txtPropertyAddress');
        //});

        ////Add marker upon clicking on map
        ////google.maps.event.addDomListener(map, 'click', addMarker);
        //google.maps.event.addDomListener(map, 'click', function () { addMarker(map); });

        var places1 = new google.maps.places.Autocomplete(document.getElementById('txtPropertyAddress'));
        google.maps.event.addListener(places1, 'place_changed', function () {
            var place1 = places1.getPlace();

            var src_addr = place1.formatted_address;
            var src_lat = place1.geometry.location.lat();
            var src_long = place1.geometry.location.lng();

            var mesg1 = "Address: " + src_addr;
            mesg1 += "\nLatitude: " + src_lat;
            mesg1 += "\nLongitude: " + src_long;
            //alert(mesg1);

            document.getElementById('src_lat').value = src_lat;
            document.getElementById('src_long').value = src_long;
            //document.getElementById('pickup_location').innerHTML = src_lat + ' , ' + src_long;

            $('.txtLatitude').val(src_lat);
            $('.txtLongitude').val(src_long);

        });

        //Add marker upon place change
        //google.maps.event.addDomListener(places1, 'place_changed', addMarker);            
        google.maps.event.addDomListener(places1, 'place_changed', function () { addMarker(map); });
    }
}

function loadMap() {
    var lat = $('#src_lat').val();
    var lng = $('#src_long').val();

    updateLocation(lat, lng);
}

function refreshMap() {
    var geocoder = new google.maps.Geocoder;
    var infowindow = new google.maps.InfoWindow;
    geocodeLatLng(geocoder, map, infowindow, $('.txtLatitude').val(), $('.txtLongitude').val(), 'txtPropertyAddress');

    updateLocation($('.txtLatitude').val(), $('.txtLongitude').val());
}

$(document).ready(function () {
    $('.txtLatitude').keyup(function () {

        if ((mUpdateDrag == false) && (mUpdateAddress == false) && (mUpdateLongitude == false)) {
            mUpdateLatitude = true;
            mUpdateDrag = false;
            mUpdateAddress = false;
            mUpdateLongitude = false;

            document.getElementById('src_lat').value = $('.txtLatitude').val();

            if (($('.txtLatitude').val().length > 0) && ($('.txtLongitude').val().length > 0)) {
                var geocoder = new google.maps.Geocoder;
                var infowindow = new google.maps.InfoWindow;
                geocodeLatLng(geocoder, map, infowindow, $('.txtLatitude').val(), $('.txtLongitude').val(), 'txtPropertyAddress');

                updateLocation($('.txtLatitude').val(), $('.txtLongitude').val());

                refreshValues();
            }
        }
    });

    $('.txtLongitude').keyup(function () {

        if ((mUpdateDrag == false) && (mUpdateAddress == false) && (mUpdateLatitude == false)) {
            mUpdateLatitude = false;
            mUpdateDrag = false;
            mUpdateAddress = false;
            mUpdateLongitude = true;

            document.getElementById('src_long').value = $('.txtLongitude').val();

            if (($('.txtLatitude').val().length > 0) && ($('.txtLongitude').val().length > 0)) {
                var geocoder = new google.maps.Geocoder;
                var infowindow = new google.maps.InfoWindow;
                geocodeLatLng(geocoder, map, infowindow, $('.txtLatitude').val(), $('.txtLongitude').val(), 'txtPropertyAddress');

                updateLocation($('.txtLatitude').val(), $('.txtLongitude').val());

                refreshValues();
            }
        }
    });

    $('#btnGetCoordinates').click(function () {

        if ((mUpdateDrag == false) && (mUpdateLongitude == false) && (mUpdateLatitude == false)) {
            mUpdateLatitude = false;
            mUpdateDrag = false;
            mUpdateAddress = true;
            mUpdateLongitude = false;

            var address = $('.hdPropertyAddress').text();

            geoCoder = new google.maps.Geocoder;

            if (address.length > 0) {
                geoCoder.geocode({ 'address': address }, function (results, status) {
                    if (status == google.maps.GeocoderStatus.OK) {

                        $('.txtLatitude').val(results[0].geometry.location.lat());
                        $('.txtLongitude').val(results[0].geometry.location.lng());

                        document.getElementById('src_lat').value = results[0].geometry.location.lat();
                        document.getElementById('src_long').value = results[0].geometry.location.lng();

                        updateLocation(results[0].geometry.location.lat().toString(), results[0].geometry.location.lng().toString());

                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });

                        refreshValues();
                    } else {
                        alert("Geocode was not successful for the following reason: " + status);
                    }
                });
            }
        }
    });
});