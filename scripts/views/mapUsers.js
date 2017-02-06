
(function closure(firebase) {
  var map
  var google

//draws map
  window.initMap = function initMap() {
    console.log('making map');
    google = window.google;
    var styleArray = [
      {
        featureType: 'all',
        stylers: [
            { saturation: -80 },
        ],
      }, {
        featureType: 'road.arterial',
        elementType: 'geometry',
        stylers: [
            { hue: '#00ffee' },
            { saturation: 50 },
        ],
      }, {
        featureType: 'poi.business',
        elementType: 'labels',
        stylers: [
            { visibility: 'off' },
        ],
      },
    ];
    var options = {
      zoom: 4,
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: false,
      styles: styleArray,
      mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(document.getElementById('map'), options);
    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(40, -124.39),
      new google.maps.LatLng(49.38, -66.94)
    );
    map.fitBounds(bounds);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': 'US' }, function onGeocode(results, status) {
      map.setCenter(results[0].geometry.location);
      google.maps.event.addDomListener(window, 'resize', function onResize() {
        google.maps.event.trigger(map, 'resize');
        map.setCenter(results[0].geometry.location);
        map.fitBounds(bounds);
      });
    });
  };

  window.recenterMap = function(markers) {
    var bounds = new google.maps.LatLngBounds();
    var geocoder = new google.maps.Geocoder();
    for (var i = 0; i < markers.length; i++) {
      marker = new google.maps.LatLng(markers[i].lat, markers[i].lng);
      bounds.extend(marker);
      console.log(bounds);
    }
    geocoder.geocode({ 'address': markers[0].address}, function onGeocode(results, status) {
      map.setCenter(results[0].geometry.location);
      google.maps.event.trigger(map, 'resize');
      map.setCenter(results[0].geometry.location);
      map.fitBounds(bounds);
    });
  };

// listens for new events
  firebase.database().ref('/townHalls/').on('child_added', function getSnapShot(snapshot) {
    var ele = new TownHall (snapshot.val());
    ele.Date = ele.Date.toDateString();
    $('#all-events-table').append(ele.toHtml($('#table-template')));
    var coords = [ele.lng, ele.lat];
    var latLng = new google.maps.LatLng(coords[1], coords[0]);
    // eslint-disable-next-line no-unused-vars
    var contentString = ele.toHtml('#event-template');
    var infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 200
    });
    var marker = new google.maps.Marker({
      strokeColor: '#FF0000',
      strokeOpacity: 0.8,
      strokeWeight: 0.5,
      fillColor: '#FF0000',
      fillOpacity: 0.35,
      map: map,
      position: latLng,
      name: ele.name,
      time: ele.time,
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
  });

}(window.firebase));
