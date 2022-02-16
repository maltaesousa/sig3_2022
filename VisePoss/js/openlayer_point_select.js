// Inspiration provenant du site : https://openlayers.org/en/latest/examples/synthetic-points.html
// fonction de recherche du point le plus proche
let liste_points_geom = [];
let liste_points_attr = [];
let liste_lines = [];
let coordinate = [];
const displaySnap = function (coordinate) {
  liste_points_geom = [];
  liste_points_attr = [];
  liste_lines = [];
  // créer un cercle avec la position du curseur et le rayon de recherche
  const circle = new ol.geom.Circle(coordinate, range);
  // itération sur les points qui intersectent le cercle
  for (const couche of liste_couches) {
    source = couche.getSource();
    source.forEachFeatureInExtent(circle.getExtent(), function (feature) {
      if (circle.intersectsExtent(feature.getGeometry().getExtent())) {
        point = new ol.geom.Point(feature.getGeometry().getCoordinates());
        liste_points_attr.push(feature);
        liste_points_geom.push(point);
        line = new ol.geom.LineString([coordinate, feature.getGeometry().getCoordinates()]);
        liste_lines.push(line);
      }
    });
  };
  map.render();
}
// lors du mouvement de la souris, lancer une fonction
map.on('pointermove', function drawLine(evt) {
  if (!freezeLine) {
    if (evt.dragging) {
      return;
    }
    coordinate = evt.coordinate;
    // lancer la fonction de sélection avec coordinate = position du curseur
    displaySnap(coordinate);
  }
});

// appliquer le style au élément sélectionné et les afficher sur la carte
linesLayer.on('postrender', function (evt) {
  const vectorContext = ol.render.getVectorContext(evt);
  vectorContext.setStyle(style_select);
  if (liste_points_geom !== null) {
    liste_points_geom.forEach(function (pt) {
      vectorContext.drawGeometry(pt);
    })
  }
  if (liste_lines !== null) {
    liste_lines.forEach(function (li) {
      vectorContext.drawGeometry(li);
    })
  }
});