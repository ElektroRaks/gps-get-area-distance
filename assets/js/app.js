let currentLocation = null;
let locationA = null;
let locationB = null;

function main() {
    let geolocation = null;
    if (window.navigator && window.navigator.geolocation) {
        geolocation = window.navigator.geolocation;
    }
    if (geolocation) {
        geolocation.watchPosition(onLocationUpdate, onError, {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 10000
        })
    } else {
        alert("Geolocation is not supported by your browser");
        return;
    }
}

function onLocationUpdate(event) {
    console.log(event);
    currentLocation = event.coords;
    let location = document.getElementById("location");
    if (location) {
        location.innerHTML = `Latitude: ${currentLocation.latitude}<br>Longitude: ${currentLocation.longitude}`;
    }
    updateMap();
}

function onError(error) {
    console.log(error);
    let message = "Cannot get location";
    switch (error.code) {
        case error.PERMISSION_DENIED:
            message = "User denied the request for Geolocation.";
            break;
        case error.POSITION_UNAVAILABLE:
            message = "Location information is unavailable.";
            break;
        case error.TIMEOUT:
            message = "The request to get user location timed out.";
            break;
        case error.UNKNOWN_ERROR:
            message = "An unknown error occurred.";
            break;
    }
    alert(message);
}

function setLocationA() {
    locationA = currentLocation;
    let location_A = document.getElementById("locationAinfo");
    if (location_A) {
        location_A.innerHTML = `Latitude: ${locationA.latitude}<br>Longitude: ${locationA.longitude}`;
    }
    UpdateInfo();
    viewMapAandBwithLineandPoint();
}

function setLocationB() {
    locationB = currentLocation;
    let location_B = document.getElementById("locationBinfo");
    if (location_B) {
        location_B.innerHTML = `Latitude: ${locationB.latitude}<br>Longitude: ${locationB.longitude}`;
    }
    UpdateInfo();
    viewMapAandBwithLineandPoint();
}

function UpdateInfo() {
    if (!locationA || !locationB) {
        return;
    }
    let distance = getDistance(locationA, locationB);
    let info = document.getElementById("info");
    if (info) {
        info.innerHTML = `Location A: ${locationA.latitude}, ${locationA.longitude}<br>Location B: ${locationB.latitude}, ${locationB.longitude}<br>Distance: ${identifyDistanceMeterorKilometer(distance)}`;
    }
}

function identifyDistanceMeterorKilometer(distance) {
    let distanceInMeter = distance * 1000;
    if (distanceInMeter < 1) {
        return distanceInMeter.toFixed(2) + "m";
    }
    return distance.toFixed(2) + "km";
}

function locationToxyz(location , radius) {
    const xyz = { x: 0, y: 0, z: 0 };
    xyz.y = Math.sin(degToRad(location.latitude)) * radius;
    const r = Math.cos(degToRad(location.latitude))*radius;
    xyz.x = Math.cos(degToRad(location.longitude))*r;
    xyz.z = Math.sin(degToRad(location.longitude))*r;
    return xyz;
}

function degToRad(deg) {
    return deg * (Math.PI / 180);
}

function getDistance(locationA, locationB) {
    const radius = 6371;
    const xyz1 = locationToxyz(locationA , radius);
    const xyz2 = locationToxyz(locationB, radius);
    const euclideanDistance = Math.sqrt(Math.pow(xyz1.x - xyz2.x, 2) + Math.pow(xyz1.y - xyz2.y, 2) + Math.pow(xyz1.z - xyz2.z, 2));   
    return euclideanDistance;
}

let leafletMap = null;

function updateMap() {
    if (!currentLocation) {
        return;
    }

    let mapContainer = document.getElementById("map");

    // Remove existing map if already initialized
    if (leafletMap !== null) {
        leafletMap.remove();
        leafletMap = null;
    }

    // Create new map container
    mapContainer.innerHTML = "<div id='leaflet-map' style='width: 100%; height: 450px;'></div>";

    // Initialize Leaflet map
    leafletMap = L.map('leaflet-map').setView([currentLocation.latitude, currentLocation.longitude], 15);

    // Add dark tile layer
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution: '&copy; OpenStreetMap & CARTO',
        subdomains: 'abcd',
        maxZoom: 19
    }).addTo(leafletMap);

    // Add a marker
    L.marker([currentLocation.latitude, currentLocation.longitude]).addTo(leafletMap)
        .bindPopup("You are here!")
        .openPopup();
}

function viewMapAandBwithLineandPoint() {
    if (!locationA || !locationB) {
        return;
    }
    L.polyline([[locationA.latitude, locationA.longitude], [locationB.latitude, locationB.longitude]], {color: 'red'}).addTo(leafletMap);
    L.marker([locationA.latitude, locationA.longitude]).addTo(leafletMap)
        .bindPopup("Location A")
        .openPopup();
    L.marker([locationB.latitude, locationB.longitude]).addTo(leafletMap)
        .bindPopup("Location B")
        .openPopup();
}

main();

// old map
// function updateMap() {
//     if (!currentLocation) {
//         return;
//     }
//     let map = document.getElementById("map");
//     if (map) {
//         let url = `https://maps.google.com/maps?q=${currentLocation.latitude},${currentLocation.longitude}&z=15&output=embed`;
//         map.innerHTML = `<iframe src="${url}" width="100%" height="450" style="border:0;" allowfullscreen="allowfullscreen" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>`;
//     }
// }
