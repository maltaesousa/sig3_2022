let stationCoordinates = [];

// action à effectuer lors du clic sur la carte
map.on('click', function (evt) {
  if (!freezeLine) {
    stationCoordinates = evt.coordinate;
    // figer l'apeçu des visées
    freezeLine = true;

    // Création de l'url de requête au server
    let url_base = 'http://localhost:8000?';
    let url = url_base.concat("getAlti&", stationCoordinates[0].toFixed(3), '&', stationCoordinates[1].toFixed(3))
    console.log('Cette page tente de joindre:', url);
    // Requête au server
    $.ajax({
      url: url,
      type: 'GET',
      // fonction a effectuer en cas de réussite de la requete
      success: function (dataFromServer) {
        for (const point of dataFromServer) {
          if (point[0] != null) {
            alti_station = point[0]
            console.log("Altitude de la station : " + alti_station.toFixed(1))
            $('#stationCoord').text('Coordonnées de la station [m] : ' + stationCoordinates[0].toFixed(3) + ' / ' + stationCoordinates[1].toFixed(3) + ' / ' + alti_station.toFixed(1));
          }
        }
        // créer le point dans OL
        point = new ol.geom.Point(stationCoordinates);
        var feature = new ol.Feature({
          Numero: num_station,
          Type: 'Station',
          Signe: 'Station',
          GeomAlt: alti_station.toFixed(1),
          geometry: point
        });
        // ajouter le style
        feature.setStyle(style_station);
        // ajouter le point à la carte
        stationSource.addFeature(feature);
        map.render();
        // Afficher les coordonnées et altitude de la station
        $('#button_addStation').addClass("btn-success");
        $('#button_deleteStation').addClass("btn-danger");
        // ajout de la liste des points à l'HTML
        listPointsHTML();
      }
    });
  }
});

// ajouter la liste des points à l'HTML
function listPointsHTML() {
  // suprimer l'existant
  $("#list-tab").empty();
  $("#list-tab").addClass("list-scroll");
  $("#nav-tabContent").empty();

  // ajouter la liste
  i = 1;
  for (const point_vise of liste_points_attr) {
    // Récupération des informations du point
    num = point_vise.get('Numero');
    geom = point_vise.getGeometry().getCoordinates();
    Est = geom[0].toFixed(3);
    Nord = geom[1].toFixed(3);
    Alti = point_vise.get('GeomAlt');
    ligne_vise = new ol.geom.LineString([coordinate, geom]);
    Dist = ol.sphere.getLength(ligne_vise).toFixed(3);
    Signe = point_vise.get('Signe');
    Type = point_vise.get('Type');

    // ajouter le point à la liste HTML
    $("#list-tab").append(`<a class="list-group-item list-group-item-action " id="list-pt${i}-list" data-toggle="list" href="#list-pt${i}" role="tab" aria-controls="pt${i}" onClick="getData(${Est},${Nord},${i},${Dist})">${Type} - ${num}</a>`);
    $("#nav-tabContent").append(`
    <div class="tab-pane fade show " id="list-pt${i}" role="tabpanel" aria-labelledby="list-pt${i}-list">
      <table class="table">
        <thead class="thead-dark">
          <tr>
            <th scope="col">Distance</th>
            <th scope="col">Est</th>
            <th scope="col">Nord</th>
            <th scope="col">Altitude</th>
            <th scope="col">Signe</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${Dist}</td>
            <td>${Est}</td>
            <td>${Nord}</td>
            <td>${Alti}</td>
            <td>${Signe}</td>
          </tr>
        </tbody>
      </table>
      <div id="spinner${i}" class="d-flex justify-content-center">
        <div class="spinner-border text-primary d-flex justify-content-center" role="status"></div>
      </div>
      <div id='profil${i}'>
      </div>
    </div>`);
    i++;
  }
}

// fonction pour ajouter la nouvelle station à la carte
function addStation() {
  if (freezeLine) {
    $('#button_addStation').removeClass("btn-success");
    $('#button_deleteStation').removeClass("btn-danger");
    freezeLine = false;
    liste_profil_genere = [];
  }
}