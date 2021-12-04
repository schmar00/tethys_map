let USER_LANG = (navigator.language || navigator.language).substring(0, 2);
let map = L.map('map').setView([47.7, 13.5], 7);

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

  for (let i in tethys) {

    let bounds = [
      [tethys[i].south, tethys[i].west],
      [tethys[i].north, tethys[i].east]
    ];

    let blattWidth = tethys[i].east - tethys[i].west;

    L.rectangle(bounds, {
      'color': (/GEOFAST/g).test(tethys[i].title) ? 'red' : 'green',
      'fill': (blattWidth > 0.3) ? false : true,
      'weight': (blattWidth > 0.3) ? 3 : 1
    }).addTo(map).bindPopup(`<p>DOI: <a href="https://doi.org/${tethys[i].doi}">${tethys[i].doi}</a>
                              <br><strong>${tethys[i].title}</strong><br>
                              publ.: ${tethys[i].creator}<br>
                              und ${tethys[i].contributor}
                            </p>`);

  }
  let popup = L.popup();
  $('#loading').hide();

}