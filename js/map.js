let USER_LANG = (navigator.language || navigator.language).substring(0, 2);
let map = L.map('map').setView([47.7, 13.5], 7);

$("#loadOAI").click(function () {
  $('.loading').show();
  getData();
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
  //getData();
  mapData();

});


async function getData() {

  let resumptionToken = '';
  //let completeListSize = '';
  let allData = [];

  for (i = 0; i < 11; i++) {
    const contents = await $.getScript("load.php" + resumptionToken, function (data, textStatus, jqxhr) {
      //console.log(data);
      //remove xml part after </OAI-PMH>
      let parser = new DOMParser(),
        xmlDoc = parser.parseFromString(data.split('</OAI-PMH>')[0] + '</OAI-PMH>', 'text/xml');
      //console.log('resumptionToken: ' + $(xmlDoc).find('resumptionToken').text());
      resumptionToken = '?resumptionToken=' + $(xmlDoc).find('resumptionToken').text();
      //console.log('completeListSize: ' + $(xmlDoc).find('resumptionToken').attr('completeListSize'));

      $(xmlDoc).find("record").each(function () {
        allData.push({
          doi: 'https://doi' + $(this).find('dc\\:identifier').text().split('doi')[1].split('http')[
            0],
          title: $(this).find('dc\\:title').first().text(),
          creator: $.map($(this).find('dc\\:creator'), $.text),
          coverage: $(this).find('dc\\:coverage').text().split(' * ').map(a => parseFloat(a.split(': ')[1])),
          date: $(this).find('dc\\:date').text()
        });
      });
    });
  }
  //console.log(allData);

  fetch("update.php", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
      },
      body: `newData=${'const oaiArr = ' + JSON.stringify(allData) + ';'}`,
    })
    .then((response) => response.text())
    .then((res) => {
      alert('OAI aktualisiert');
      $('.loading').hide();
    });
}


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
  let title = '';
  let creators = '';

  for (let i in oaiArr) {

    let bounds = [
      [oaiArr[i].coverage[1], oaiArr[i].coverage[0]],
      [oaiArr[i].coverage[3], oaiArr[i].coverage[2]]
    ];


    let blattWidth = oaiArr[i].coverage[3] - oaiArr[i].coverage[1];
    //console.log(blattWidth, oaiArr[i].title, bounds);
    title = $('<div>').text(oaiArr[i].title).html();
    title = decodeHtml(title);
    creators = $('<div>').text(oaiArr[i].creator.map(a=>a.replace(',','')).join(', ')).html();
    creators = decodeHtml(creators);

    L.rectangle(bounds, {
      'color': (/GEOFAST/g).test(oaiArr[i].title) ? 'red' : 'green',
      'fill': (blattWidth > 0.3) ? false : true,
      'weight': (blattWidth > 0.3) ? 3 : 1
    }).addTo(map).bindPopup(`<a href="${oaiArr[i].doi}">${oaiArr[i].doi}</a>
                                <p><strong>${title}</strong>
                                  <br>publ.${oaiArr[i].date.substr(0, 4)} by ${creators}
                                </p>`);

  }
  let popup = L.popup();
  $('#loading').hide();

}

function decodeHtml(a) {
  let char = {
    '\\Ä': '&#196;',
    '\\Ö': '&#214;',
    '\\Ü': '&#220;',
    '\\ä': '&#228;',
    '\\ö': '&#246;',
    '\\ü': '&#252;',
    '\\ß': '&#223;'
  };
  return a.replace(/\\Ä|\\Ö|\\Ü|\\ä|\\ö|\\ü|\\ß/g, m => char[m]);
}