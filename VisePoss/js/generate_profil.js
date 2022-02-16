// Liste des profils deja genere
let liste_profil_genere = []

function getData(e_vise, n_vise, id_profil, dist) {
  // zoomer sur le point sélectionné
  map.getView().setCenter([e_vise, n_vise]);
  map.getView().setZoom(19);
  // Test si le profil est deja genere
  if (!liste_profil_genere.includes(id_profil)) {
    // Création de l'url de requête au server
    let url_base = 'http://localhost:8000?';
    let url = url_base.concat("getProfil&", stationCoordinates[0].toFixed(3), '&', stationCoordinates[1].toFixed(3), '&', e_vise, '&', n_vise)

    let alti_profil = [];
    let dist_profil = [];
    i = 0
    // Requête au server
    $.ajax({
      url: url,
      type: 'GET',
      success: function (dataFromServer) {
        // mise en forme des résultats
        for (const point of dataFromServer) {
          alti_profil.push(Number(point[0].toFixed(1)));
          dist_profil.push(i);
          i++;
        }

        // Création du profil plotly
        createPlotly(alti_profil, dist_profil, id_profil, dist);
        $(`#spinner${id_profil}`).empty();
        liste_profil_genere.push(id_profil);
      }
    });
  }
}