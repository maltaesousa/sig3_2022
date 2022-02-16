// ####################################################################################
// ************************************************************************************

// PROJET DE SYSINFGEO3 - SEMESTRE D'AUTOMNE 2021-2022 - HEIG-VD
// GROUPE: PELLAUD Pierre & SMOLIK Marin
// PROFESSEURS: MALTA E SOUSA Stéphane & INGENSAND Jens
// DATE: le 16 Janvier 2022

// *************************************************************************************
// #####################################################################################

// Fichier de symbologie des bases

// Style pour les regions selectionnées lors des tirs ratés
const tirRate = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(100,100,100,1)' // Gris
    }),
    stroke: new ol.style.Stroke({
        color: '#C70039',
        width: 1
    })
});

// Style pour les regions selectionnées lors des tirs réussi
const tirTouche = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(0,0,0,1)' // Noir
    }),
    stroke: new ol.style.Stroke({
        color: '#C70039',
        width: 1
    })
});

// Style pour les regions selectionnées sur le choix des bases
const highlightStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(255,0,0,0.2)' // Rouge 
    }),
    stroke: new ol.style.Stroke({
        color: '#3399CC',
        width: 3
    })
});

// Style pour les regions mitoyennes à la selection
const bufferStyle = new ol.style.Style({
    fill: new ol.style.Fill({
        color: 'rgba(176,242,182,0.3)' // Vert
    }),
    stroke: new ol.style.Stroke({
        color: '#22780F',
        width: 3
    })
});
