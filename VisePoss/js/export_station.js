// exporter les points de stations
function expStation() {
    let csvContent = ""
    let list = [["Numero", "Est", "Nord"]]
    // iteration sur la couche des stations
    stationSource.forEachFeature(function (feature) {
        num = feature.get('Numero');
        geom = feature.getGeometry().getCoordinates();
        Est = geom[0].toFixed(3);
        Nord = geom[1].toFixed(3);
        Alti = feature.get('GeomAlt');

        list.push([num, Est, Nord, Alti]);
    })
    // création d'une url avec le contenu du CSV
    csvContent = "data:text/csv;charset=utf-8," + list.map(e => e.join(";")).join("\n");
    let url = encodeURI(csvContent);
    // ouvrir l'url, se qui lance le telechargement
    window.open(url);
}