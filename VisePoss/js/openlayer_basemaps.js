// changer la carte de fond
function toggleBasemaps(basemap) {
    for (const couche of liste_basemaps) {
        try {
            map.removeLayer(couche);
        } catch (error) { }
    }
    map.addLayer(basemap);
}