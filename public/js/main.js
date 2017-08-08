function onDocumentReady() {
	var socket = io.connect(window.location.href);

	var map = L.map('mimapa', {
    	center: [-10.6776695, -76.2612763],
    	zoom: 14
	});

	var tiles = L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png');

	map.addLayer(tiles);

	map.locate({
		enableHighAccuracy: true
	});

	map.on('locationfound', onLocationFound);

	socket.on('coords:user', onReceiveData);

	function onLocationFound(position){
		var mycoords = position.latlng;
		var marker = L.marker([mycoords.lat, mycoords.lng]);
		map.addLayer(marker);
		marker.bindPopup('Estas Aqui');
		
		socket.emit('coords:me', {latlng: mycoords});
	}

	function onReceiveData(data){
		console.log(data)
		var coordsUser = data.latlng;
		var marker = L.marker([coordsUser.lat, coordsUser.lng]);
		map.addLayer(marker);
		marker.bindPopup('Estas Aqui');			
	}
}

$(document).on('ready', onDocumentReady);