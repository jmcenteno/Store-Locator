var input = {
	canvasID: 'map-canvas', 
	controls: {
		address: 'address',
		radius: 'radius'
	},
	store: 'CVS Pharmacy', 
	radius: 5, 
	country: 'United States'
};

// declare an instance of the StoreLocator object
var _storeLocator = new StoreLocator(input);

window.onload = function() {
	_storeLocator.init();
}

function LocateStores(address) {

	if (address != '') {
		_storeLocator.search(address); 
	}
	
}

function ConvertRadius(miles) {
    _storeLocator.radius = _storeLocator.milesToMeters(miles);
}

function toggleMenu() {
	_storeLocator.showLocations();
}

/*
 * Store Locator
 * 
 * @author Jose Centeno
 * @version 1.0
 * @requires https://maps.googleapis.com/maps/api/js?libraries=places
 * @requires http://code.jquery.com/jquery-1.11.1.min.js
 *
 * @param input				(required) Object
 * @param input.canvasID	(required) String
 * @param input.store 		(required) String
 * @param input.radius		(required) Number
 * @param input.country		(required) String
 * 
 */
function StoreLocator(input) {
	
	if (typeof input 			!== 'object' || 
		typeof input.canvasID	!== 'string' || 
		typeof input.store		!== 'string' || 
		typeof input.radius		!== 'number' || 
		typeof input.country	!== 'string')
	{
		throw 'Cannot initiate object with the given input!';
	}

	var $this = this;
	
	$this.map = null;
	$this.infoWindow = null; 
	$this.geocoder = new google.maps.Geocoder(); 
	$this.markers = [];
	
	$this.init = function() {
		
		$this.geocoder.geocode({ 'address': input.country }, function (results, status) {
			
			if (status == google.maps.GeocoderStatus.OK) {		
				
				var latitude = results[0].geometry.location.lat();
				var longitude = results[0].geometry.location.lng(); 
								
				$this.map = new google.maps.Map(document.getElementById(input.canvasID), {
					center: new google.maps.LatLng(latitude, longitude),
					mapTypeControl: false,
					maxZoom: 18,
					zoom: 3,
					zoomControlOptions: {
						style: google.maps.ZoomControlStyle.SMALL
					},
					styles: [
					    {
					        "featureType": "water",
					        "elementType": "all",
					        "stylers": [
					            {
					                "hue": "#7fc8ed"
					            },
					            {
					                "saturation": 55
					            },
					            {
					                "lightness": -6
					            },
					            {
					                "visibility": "on"
					            }
					        ]
					    },
					    {
					        "featureType": "water",
					        "elementType": "labels",
					        "stylers": [
					            {
					                "hue": "#7fc8ed"
					            },
					            {
					                "saturation": 55
					            },
					            {
					                "lightness": -6
					            },
					            {
					                "visibility": "off"
					            }
					        ]
					    },
					    {
					        "featureType": "poi.park",
					        "elementType": "geometry",
					        "stylers": [
					            {
					                "hue": "#83cead"
					            },
					            {
					                "saturation": 1
					            },
					            {
					                "lightness": -15
					            },
					            {
					                "visibility": "on"
					            }
					        ]
					    },
					    {
					        "featureType": "landscape",
					        "elementType": "geometry",
					        "stylers": [
					            {
					                "hue": "#f3f4f4"
					            },
					            {
					                "saturation": -84
					            },
					            {
					                "lightness": 59
					            },
					            {
					                "visibility": "on"
					            }
					        ]
					    },
					    {
					        "featureType": "landscape",
					        "elementType": "labels",
					        "stylers": [
					            {
					                "hue": "#ffffff"
					            },
					            {
					                "saturation": -100
					            },
					            {
					                "lightness": 100
					            },
					            {
					                "visibility": "off"
					            }
					        ]
					    },
					    {
					        "featureType": "road",
					        "elementType": "geometry",
					        "stylers": [
					            {
					                "hue": "#ffffff"
					            },
					            {
					                "saturation": -100
					            },
					            {
					                "lightness": 100
					            },
					            {
					                "visibility": "on"
					            }
					        ]
					    },
					    {
					        "featureType": "road",
					        "elementType": "labels",
					        "stylers": [
					            {
					                "hue": "#bbbbbb"
					            },
					            {
					                "saturation": -100
					            },
					            {
					                "lightness": 26
					            },
					            {
					                "visibility": "on"
					            }
					        ]
					    },
					    {
					        "featureType": "road.arterial",
					        "elementType": "geometry",
					        "stylers": [
					            {
					                "hue": "#ffcc00"
					            },
					            {
					                "saturation": 100
					            },
					            {
					                "lightness": -35
					            },
					            {
					                "visibility": "simplified"
					            }
					        ]
					    },
					    {
					        "featureType": "road.highway",
					        "elementType": "geometry",
					        "stylers": [
					            {
					                "hue": "#ffcc00"
					            },
					            {
					                "saturation": 100
					            },
					            {
					                "lightness": -22
					            },
					            {
					                "visibility": "on"
					            }
					        ]
					    },
					    {
					        "featureType": "poi.school",
					        "elementType": "all",
					        "stylers": [
					            {
					                "hue": "#d7e4e4"
					            },
					            {
					                "saturation": -60
					            },
					            {
					                "lightness": 23
					            },
					            {
					                "visibility": "on"
					            }
					        ]
					    }
					]
				});
				
				var address_input = document.getElementById(input.controls.address);
  				$this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(address_input);

  				var radius_input = document.getElementById(input.controls.radius);
  				$this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(radius_input);

  				var autocomplete = new google.maps.places.Autocomplete(address_input);
  				autocomplete.bindTo('bounds', $this.map);

  				google.maps.event.addListener(autocomplete, 'place_changed', function() {
					
					$this.infoWindow.close();
					
					var place = autocomplete.getPlace();
					if (!place.geometry) {
						return;
					}

					$this.search(place.formatted_address);

				});

				$this.infoWindow = new google.maps.InfoWindow();
				
			}
			
		});
		
		$this.clearMarkers();
		
	};
		
	$this.destroy = function() {
		
		$this.map = null;
		jQuery('#' + input.canvasID + ' div').remove();
	
	};
	
	$this.search = function(address) {
		
		$this.geocoder.geocode({ 'address': address }, function (results, status) {
			
			if (status == google.maps.GeocoderStatus.OK) {
						
				var latitude = results[0].geometry.location.lat();
				var longitude = results[0].geometry.location.lng();
				
				$this.clearMarkers();
				
				var LatLng = new google.maps.LatLng(latitude, longitude);
				$this.map.setCenter(LatLng);
                //$this.init();
				
				var request = {
					location: LatLng,
					radius: $this.radius,
					name: input.store,
					types: ['store']
				};
							
				var service = new google.maps.places.PlacesService($this.map);
				
				service.radarSearch(request, function(results, status) {
					
					if (status == google.maps.places.PlacesServiceStatus.OK) {
						
						jQuery('.store-locations .store').remove();
						
						var counter = 0;
						console.log(results.length);

						var center = $this.getMapCenter(results);						
						
						$this.map.fitBounds(center.bounds);

						var t = setInterval(function() {

							if (counter > results.length-1) {
								
								clearInterval(t);

								jQuery('.store-locations').addClass('open');
								jQuery('.store-locations .menu-toggle').addClass('show');

								return;
								
							}

	                      	service.getDetails({ reference: results[counter].reference }, $this.createMarker);
	                      	counter++;	                      	

						}, 200);
						
					} else {
						
						//$this.destroy()
						jQuery('.store-locations').removeClass('open');
						jQuery('.store-locations .menu-toggle').removeClass('show');
						
						setTimeout(function() {
							alert('No locations found in your area.');
						});
						
					}
					
				});
				
			} else {
				
				alert("Request failed.");
				
			}
			
		});
	
	};
	
	$this.createMarker = function(place, status) {
	
        if (status != google.maps.places.PlacesServiceStatus.OK) {
            return;
        }
		
		var marker = new google.maps.Marker({
			map: $this.map,
			title: place.name,
			position: place.geometry.location,
			animation: google.maps.Animation.DROP
		});

		google.maps.event.addListener(marker, 'click', function() {
			console.log(this)
		})
		
		$this.markers.push(marker);
	
		var store = jQuery('<div/>', { 'class': 'store', 'data-index': ($this.markers.length - 1) });
		store.append(jQuery('<div/>', { 'class': 'store-name' }).text(place.name));
		store.append(jQuery('<div/>', { 'class': 'store-address' }).html(place.adr_address.replace(/,/g, '')));
			
		if (typeof place.formatted_phone_number !== 'undefined' && place.formatted_phone_number != '') {
			store.append(jQuery('<div/>', { 'class': 'store-phone' }).html('<strong>Phone:</strong> ' + place.formatted_phone_number));	
		}
		
		store.on('mouseenter', function(e) {
		
			_storeLocator.markers[jQuery(this).data('index')].setAnimation(google.maps.Animation.BOUNCE);
		
		}).on('mouseleave', function(e) {
		
			_storeLocator.markers[jQuery(this).data('index')].setAnimation(null);
		
		}).on('click', function(e) {

			jQuery(this).addClass('active').siblings().removeClass('active');

			var center = _storeLocator.markers[jQuery(this).data('index')].getPosition();
			$this.map.setCenter(center);
		
		});
		
		store.find('.locality').append(', ');
		store.find('.country-name').remove();
		
		jQuery('.store-locations .scroller-content').append(store);
	
	};
	
	$this.clearMarkers = function() {
		
		for (var i = 0; i < $this.markers.length; i++) {
			$this.markers[i].setMap(null);
		}
		
		$this.markers = [];
		
	};
	
	$this.milesToMeters = function(miles) {			
		return (miles * 1.609344) * 1000;
	};
	
	$this.radius = $this.milesToMeters(input.radius);
	
	$this.getMapCenter = function(results) {

        var latitude = {
            low: 90,
            high: -90
        };
        
        var longitude = {
            low: 180,
            high: -180
        };
        
        for (var i=0; i<results.length; i++) {
                
            if (results[i].geometry.location.lat() > latitude.high) {
                latitude.high = results[i].geometry.location.lat();
            }
            
            if (results[i].geometry.location.lng() > longitude.high) {
                longitude.high = results[i].geometry.location.lng();
            }
                
            if (results[i].geometry.location.lat() < latitude.low) {
                latitude.low = results[i].geometry.location.lat();
            }
            
            if (results[i].geometry.location.lng() < longitude.low) {
                longitude.low = results[i].geometry.location.lng();
            }
            
        }
                        
        return {
            bounds: new google.maps.LatLngBounds(new google.maps.LatLng(latitude.low, longitude.low), new google.maps.LatLng(latitude.high, longitude.high)),
            LatLng: new google.maps.LatLng((latitude.low + latitude.high) / 2, (longitude.low + longitude.high) / 2)
        };
        
    };

    $this.showLocations = function() {
    	jQuery('.store-locations').toggleClass('open');
    };
	
}

