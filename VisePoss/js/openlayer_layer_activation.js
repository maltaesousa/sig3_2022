//  fonction d'activation / désactivation des couches

function layerVisibility(button, couches) {
    for (const couche of couches) {
        if (button.checked) {
            map.addLayer(couche);
            liste_couches.push(couche)
        } else {
            map.removeLayer(couche);
            liste_temp = liste_couches.slice(0);
            liste_couches = [];
            for (const i of liste_temp) {
                if (i !== couche) {
                    liste_couches.push(i);
                }
            }
        }
    }
}