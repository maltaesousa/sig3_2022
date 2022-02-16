// definition de la projection suisse
proj4.defs(
  "EPSG:2056",
  "+proj=somerc +lat_0=46.95240555555556 +lon_0=7.439583333333333 +k_0=1 +x_0=2600000 +y_0=1200000 +ellps=bessel +towgs84=674.374,15.056,405.346,0,0,0,0 +units=m +no_defs"
);
ol.proj.proj4.register(proj4);

// parametre de la vue
const view = new ol.View({
  projection: "EPSG:2056",
  center: [2539229.0, 1181274.0],
  zoom: 15
});

// creation de la carte
const map = new ol.Map({
  target: "map",
  view: view
});

// parametre des couches de fond
const attributions_swisstopo = [
  "Fond de plan &copy; <a href=\"https://www.swisstopo.admin.ch/fr/home.html\">swisstopo</a>"
];
const attributions_geodienste = [
  "Fond de plan &copy; <a href=\"https://geodienste.ch\">geodienste</a>"
];
// carte nationale
const carte_nationale = new ol.layer.Tile({
  id: "background-layer",
  source: new ol.source.XYZ({
    url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.pixelkarte-grau/default/current/3857/{z}/{x}/{y}.jpeg`,
    attributions: attributions_swisstopo,
  }),
  opacity: 0.8,
  zIndex: -99
});
// orthophoto
const orthophoto = new ol.layer.Tile({
  id: "background-layer",
  source: new ol.source.XYZ({
    url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swissimage/default/current/3857/{z}/{x}/{y}.jpeg`,
    attributions: attributions_swisstopo,
  }),
  zIndex: -99
});
// MO noir et blanc
const MO_nb = new ol.layer.Tile({
  id: "background-layer",
  source: new ol.source.TileWMS({
    url: `https://geodienste.ch/db/av_0/fra?`,
    params: { 'LAYERS': 'LCSF,LCSFPROJ,Conduites,SOLI,SOSF,SOPT,Adresses_des_batiments,Nomenclature,Biens_fonds,Biens_fonds_projetes,Limites_territoriales', 'TILED': true },
    attributions: attributions_geodienste,
  }),
  zIndex: -99
});
// MO couleur
const MO_co = new ol.layer.Tile({
  id: "background-layer",
  source: new ol.source.TileWMS({
    url: `https://geodienste.ch/db/av_0/fra?`,
    params: { 'LAYERS': 'LCSFC,LCSFPROJ,Conduites,SOLI,SOSF,SOPT,Adresses_des_batiments,Nomenclature,Biens_fonds,Biens_fonds_projetes,Limites_territoriales', 'TILED': true },
    attributions: attributions_geodienste,
  }),
  zIndex: -99
});
// Relief SWISSSURFACE3D
const Relief = new ol.layer.Tile({
  id: "background-layer",
  source: new ol.source.XYZ({
    url: `https://wmts.geo.admin.ch/1.0.0/ch.swisstopo.swisssurface3d-reliefschattierung-multidirektional/default/current/3857/{z}/{x}/{y}.png`,
    attributions: attributions_swisstopo,
  }),
  zIndex: -99
});


// Style des pfps
const style_pfp1 = function (feature) {
  const style_label = new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.9)' }),
      stroke: new ol.style.Stroke({ color: 'rgba(255, 0, 0, 1)', width: 1.5 }),
      points: 3,
      radius: 10,
    }),
    text: new ol.style.Text({
      text: feature.get('Numero'),
      offsetX: 20,
      offsetY: -10,
      scale: 1,
      fill: new ol.style.Fill({
        color: 'rgb(255, 0, 0)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgb(255, 255, 255)',
        lineCap: 'butt',
        width: 4
      }),
    })
  });
  return style_label;
};
const style_pfp2 = function (feature) {
  const style_label = new ol.style.Style({
    image: new ol.style.RegularShape({
      fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.9)' }),
      stroke: new ol.style.Stroke({ color: 'rgba(255, 0, 0, 1)', width: 1.5 }),
      points: 4,
      radius: 8,
      angle: Math.PI / 4,
    }),
    text: new ol.style.Text({
      text: feature.get('Numero'),
      offsetX: 20,
      offsetY: -10,
      scale: 1,
      fill: new ol.style.Fill({
        color: 'rgb(255, 0, 0)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgb(255, 255, 255)',
        lineCap: 'butt',
        width: 4
      }),
    })
  });
  return style_label;
};
const style_pfp3 = function (feature) {
  const style_label = new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.9)' }),
      stroke: new ol.style.Stroke({ color: 'rgba(0, 0, 255, 1)', width: 1.5 }),
      radius: 4,
    }),
  });
  return style_label;
};
const style_pfp3_label = function (feature) {
  const style_label = new ol.style.Style({
    text: new ol.style.Text({
      text: feature.get('Numero'),
      offsetX: 20,
      offsetY: -10,
      scale: 1,
      fill: new ol.style.Fill({
        color: 'rgb(0, 0, 255)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgb(255, 255, 255)',
        lineCap: 'butt',
        width: 4
      }),
    })
  });
  return style_label;
};

// style de la sélection
const stroke_select = new ol.style.Stroke({
  color: 'rgba(255,255,0,0.9)',
  width: 1.5,
});
const style_select = new ol.style.Style({
  stroke: stroke_select,
  image: new ol.style.Circle({
    radius: 7,
    stroke: stroke_select,
  }),
});

// style des stations
const style_station = function (feature) {
  const style_label = new ol.style.Style({
    image: new ol.style.Circle({
      fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.9)' }),
      stroke: new ol.style.Stroke({ color: 'rgba(0, 200, 0, 1)', width: 1.5 }),
      radius: 4,
    }),
    text: new ol.style.Text({
      text: feature.get('Numero'),
      offsetX: 20,
      offsetY: -10,
      scale: 1,
      fill: new ol.style.Fill({
        color: 'rgb(0, 200, 0)'
      }),
      stroke: new ol.style.Stroke({
        color: 'rgb(255, 255, 255)',
        lineCap: 'butt',
        width: 4
      }),
    })
  });
  return style_label;
};

const style_swiss = new ol.style.Style({
  fill: new ol.style.Fill({ color: 'rgba(255, 255, 255,0)' }),
});


// Couches vectorielles
const pfp1Source = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: "./data/pfp1.geojson"
});
const pfp1 = new ol.layer.Vector({
  source: pfp1Source,
  style: style_pfp1,
  minZoom: 13,
  visible: true,
  zIndex: 3
});

const pfp2Source = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: "./data/pfp2.geojson"
});
const pfp2 = new ol.layer.Vector({
  source: pfp2Source,
  style: style_pfp2,
  minZoom: 13,
  visible: true,
  zIndex: 2
});

const pfp3Source = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: "./data/pfp3.geojson"
});
const pfp3 = new ol.layer.Vector({
  source: pfp3Source,
  style: style_pfp3,
  minZoom: 15,
  visible: true,
  zIndex: 1
});
const pfp3_label = new ol.layer.Vector({
  source: pfp3Source,
  style: style_pfp3_label,
  minZoom: 17.5,
  visible: true,
  zIndex: 1
});

const stationSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: "./data/station.geojson"
});
const station = new ol.layer.Vector({
  source: stationSource,
  style: style_station,
  visible: true,
  zIndex: 5
});

const linesSource = new ol.source.Vector({
  format: new ol.format.GeoJSON(),
  url: "./data/swiss.geojson"
});
const linesLayer = new ol.layer.Vector({
  source: linesSource,
  style: style_swiss,
  minZoom: 13,
  visible: true,
  zIndex: 0
});

// Création des ensembles de couches et ajout à la carte
let liste_basemaps = [carte_nationale, orthophoto, MO_nb, MO_co, Relief]
let liste_couches = [pfp1, pfp2, pfp3, station]
map.getLayers().extend([orthophoto, pfp3, pfp3_label, pfp2, pfp1, station, linesLayer]);