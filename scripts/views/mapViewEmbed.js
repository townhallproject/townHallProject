
(function closure(firebase) {
  var map;
  var google;
  function TownHall (opts) {
    for (var key in opts) {
      this[key] = opts[key];
    }
  }

  TownHall.allTownHalls = [];
  TownHall.currentContext = [];
  TownHall.isCurrentContext = false;
  TownHall.isMap = false;

  //Handlebars write
  TownHall.prototype.toHtml= function(templateid){
    var source = $(templateid).html();
    var renderTemplate = Handlebars.compile(source);
    return renderTemplate(this);
  };

  //FIREBASE METHODS
  // Initialize Firebase
  var config = {
    apiKey: 'AIzaSyDwZ41RWIytGELNBnVpDr7Y_k1ox2F2Heg',
    authDomain: 'townhallproject-86312.firebaseapp.com',
    databaseURL: 'https://townhallproject-86312.firebaseio.com',
    storageBucket: 'townhallproject-86312.appspot.com',
    messagingSenderId: '208752196071'
  };

  firebase.initializeApp(config);
  var firebasedb = firebase.database();

//draws map
  window.initMapEmbed = function initMap() {
    google = window.google;
    var styleArray =[
      {
        'featureType': 'administrative.locality',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#0049ff'
          },
          {
            'saturation': 7
          },
          {
            'lightness': 19
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'administrative.locality',
        'elementType': 'labels.text',
        'stylers': [
          {
            'visibility': 'simplified'
          },
          {
            'saturation': '-3'
          },
          {
            'color': '#ac7570'
          }
        ]
      },
      {
        'featureType': 'administrative.locality',
        'elementType': 'labels.text.fill',
        'stylers': [
          {
            'color': '#fd7567'
          }
        ]
      },
      {
        'featureType': 'landscape',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#ff0000'
          },
          {
            'saturation': -100
          },
          {
            'lightness': 100
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'landscape.natural.landcover',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'landscape.natural.landcover',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'landscape.natural.terrain',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'poi',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#ffffff'
          },
          {
            'saturation': -100
          },
          {
            'lightness': 100
          },
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'poi.government',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'poi.school',
        'elementType': 'all',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'poi.school',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#f39247'
          },
          {
            'saturation': '0'
          },
          {
            'visibility': 'on'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'geometry',
        'stylers': [
          {
            'hue': '#ff6f00'
          },
          {
            'saturation': '100'
          },
          {
            'lightness': 31
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'color': '#ba2317'
          },
          {
            'saturation': '0'
          },
          {
            'lightness': '-17'
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'road',
        'elementType': 'labels',
        'stylers': [
          {
            'hue': '#008eff'
          },
          {
            'saturation': -93
          },
          {
            'lightness': 31
          },
          {
            'visibility': 'on'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'visibility': 'on'
          },
          {
            'color': '#f3dbc8'
          },
          {
            'saturation': '0'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'labels',
        'stylers': [
          {
            'hue': '#bbc0c4'
          },
          {
            'saturation': -93
          },
          {
            'lightness': -2
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'road.arterial',
        'elementType': 'labels.text',
        'stylers': [
          {
            'visibility': 'off'
          }
        ]
      },
      {
        'featureType': 'road.local',
        'elementType': 'geometry',
        'stylers': [
          {
            'hue': '#007fff'
          },
          {
            'saturation': -90
          },
          {
            'lightness': -8
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'road.local',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#ba2317'
          }
        ]
      },
      {
        'featureType': 'transit',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#e9ebed'
          },
          {
            'saturation': 10
          },
          {
            'lightness': 69
          },
          {
            'visibility': 'on'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'all',
        'stylers': [
          {
            'hue': '#b6e5fb'
          },
          {
            'saturation': -78
          },
          {
            'lightness': 67
          },
          {
            'visibility': 'simplified'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'geometry.fill',
        'stylers': [
          {
            'color': '#b6e5fb'
          },
          {
            'saturation': '-72'
          },
          {
            'lightness': '10'
          }
        ]
      },
      {
        'featureType': 'water',
        'elementType': 'geometry.stroke',
        'stylers': [
          {
            'color': '#6496af'
          }
        ]
      }
    ];

    var options = {
      zoom: 4,
      scrollwheel: false,
      navigationControl: false,
      mapTypeControl: false,
      styles: styleArray,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    };

    map = new google.maps.Map(document.getElementById('mapEmbed'), options);
    var bounds = new google.maps.LatLngBounds(
      new google.maps.LatLng(20, -124.39),
      new google.maps.LatLng(49.38, -66.94)
    );
    map.fitBounds(bounds);
    google.maps.event.addDomListener(window, 'resize', onResizeMap)
  };

  window.onResizeMap = function onResizeMap() {
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({ 'address': 'US' }, function onGeocode(results, status) {
      google.maps.event.trigger(map, 'resize');
      // map.setCenter(results[0].geometry.location);
      var resizeBounds = new google.maps.LatLngBounds();
      var data = TownHall.isCurrentContext ? TownHall.currentContext:TownHall.allTownHalls;
      if ( TownHall.zipQuery) {
        resizeBounds.extend(TownHall.zipQuery);
      }
      data.forEach(function(ele){
        marker = new google.maps.LatLng(ele.lat, ele.lng);
        resizeBounds.extend(marker);
      });
    // map.setCenter(results[0].geometry.location);
      map.fitBounds(resizeBounds);
    });
  };

  // TODO; Probably redudent with resize map
  window.recenterMap = function(markers, zipQuery) {
    google.maps.event.trigger(map, 'resize');
    var bounds = new google.maps.LatLngBounds();
    var geocoder = new google.maps.Geocoder();
    for (var i = 0; i < markers.length; i++) {
      marker = new google.maps.LatLng(markers[i].lat, markers[i].lng);
      bounds.extend(marker);
    }
      // google.maps.event.trigger(map, 'resize');
    bounds.extend(zipQuery);
    map.setCenter(zipQuery);
    map.fitBounds(bounds);
      //TODO: add maker for search query, but need to be able to remove it.
      // var marker = new google.maps.Marker({
      //   map: map,
      //   position: zipQuery,
      //   name: 'zipQuery',
      //
      // })
  };

// listens for new events
// Adds all events into main data array
// Adds all events as markers
// renders tables
// TODO: sperate out into more concise functions
  window.readData = function (){
    firebase.database().ref('/townHalls/').on('child_added', function getSnapShot(snapshot) {
      var ele = new TownHall (snapshot.val());
      var id = ele.Member+ele.Date;
      ele.rowid = id.replace(/[\W]/g, '');
      var coords = [ele.lng, ele.lat];
      TownHall.allTownHalls.push(ele);
      var latLng = new google.maps.LatLng(coords[1], coords[0]);
      // eslint-disable-next-line no-unused-vars
      ele.addressLink = "https://www.google.com/maps?q=" + escape(ele.address);
      var contentString = ele.toHtml('#marker-template');
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
        time: ele.time
      });
      marker.setIcon('https://maps.google.com/mapfiles/ms/icons/red-dot.png');
      marker.addListener('click', function() {
        infowindow.open(map, marker);
      });
    });
  };

  readData();

}(window.firebase));
