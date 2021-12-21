let USER_LANG = (navigator.language || navigator.language).substring(0, 2);
let LAYER = 'Map';
let map = L.map('map').setView([47.7, 13.5], 7);
//console.log(window.location.href.split('?')[0]);

$("#loadOAI").click(function () {
  $('.loading').show();
  window.location.href = 'https://resource.geolba.net/tethys/harvestOAI.php';
  // get https://resource.geolba.net/tethys/harvestOAI.php
});
$(function () {
  $('[data-toggle="tooltip"]').tooltip()
})

document.addEventListener("DOMContentLoaded", function (event) {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);

  if (urlParams.has('lang')) {
    USER_LANG = urlParams.get('lang');
  }

  if (urlParams.has('layer')) {
    LAYER = urlParams.get('layer');
    document.getElementById('heading').innerHTML = LAYER;
  }

  createMap();
  mapData();
});

function createMap() {

  L.tileLayer("https://{s}.wien.gv.at/basemap/bmapgrau/normal/google3857/{z}/{y}/{x}.png", {
    subdomains: ['maps', 'maps1', 'maps2', 'maps3', 'maps4'],
    attribution: '&copy; <a href="http://basemap.at">Basemap.at</a>, <a href="http://www.geologie.ac.at">Geologie.ac.at</a>'
  }).addTo(map);
  $('.loading').hide();
  /* L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
      maxZoom: 18,
      attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, ' +
        'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
      id: 'mapbox/streets-v11',
      tileSize: 512,
      zoomOffset: -1
    }).addTo(map); */
  //***************************
}

function mapData() {
  map.createPane('bottom');
  map.getPane('bottom').style.zIndex = 550;
  map.createPane('top');
  map.getPane('top').style.zIndex = 650;

  for (let i in tethys) {
    switch (LAYER) {
      case 'gk50':
        if ((/GK50/g).test(tethys[i].subject) || (/GK 50/g).test(tethys[i].subject)) {
          addPolygon(i);
        }
        break;
      case 'geofast':
        if ((/GEOFAST/g).test(tethys[i].title)) {
          addPolygon(i);
        }
        break;
      default:
        addPolygon(i);
    }
  }
  let popup = L.popup();
  $('#loading').hide();
}

function addPolygon(i) {
  let bounds = [
    [tethys[i].south, tethys[i].west],
    [tethys[i].north, tethys[i].east]
  ];

  let bW = tethys[i].east - tethys[i].west;

  L.rectangle(bounds, {
    'color': (/GEOFAST/g).test(tethys[i].title) ? 'red' : 'green',
    'fill': (bW > 0.3) ? false : true,
    'weight': ((bW > 0.3) || (bW < 0.03)) ? 3 : 1,
    'pane': (bW > 0.2) ? 'bottom' : 'top'
  }).addTo(map).bindPopup(`<p>DOI: <a href="https://doi.org/${tethys[i].doi}">${tethys[i].doi}</a>
                            <br><strong>${tethys[i].title}</strong><br>
                            publ.: ${tethys[i].creator}<br>
                            und ${tethys[i].contributor}
                          </p>`);
}