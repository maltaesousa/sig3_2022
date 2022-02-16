// créer les variables utilisateurs lors du premier chargement de la page
setUserVariables()
// appliquer la bannière de préférence lors du chargement de la page
changeBannerOnLoad()

// récuperer les valeurs de rayon, hauteur de station et signal, numéro du point
let range = parseInt($('#slider_distance').val());
let h_station = parseFloat($('#h_station').val());
let h_signal = parseFloat($('#h_signal').val());
let num_station = $('#no_station').val();


// variable qui permet de figer les lignes de visée (aussi utiliser pour le bouton d'ajout de station)
let freezeLine = false;

// function de mise en forme de texte avec majuscule au début
// lien : https://stackoverflow.com/questions/196972/convert-string-to-title-case-with-javascript
String.prototype.toProperCase = function () {
  return this.replace(/\w\S*/g, function (txt) { return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase(); });
};

// outil pour creer des rangesfunction range(start, end) {
function make_range(start, end) {
  var ans = [];
  for (let i = start; i <= end; i++) {
    ans.push(i);
  }
  return ans;
}