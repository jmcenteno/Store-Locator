var input = {
	canvasID: 'map-canvas', 
	controls: {
		address: 'address',
		radius: 'radius'
	},
	store: 'publix', 
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

