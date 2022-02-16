// function de création du profil plotly
function createPlotly(alti_profil, dist_profil, id_profil, distance_vise) {

  // profil du terrain
  var mns = {
    x: dist_profil,
    y: alti_profil,
    name: 'MNS',
    mode: 'lines+markers',
    line: {
      color: 'rgb(80, 173, 81)',
      width: 2
    },
    marker: {
      size: 4,
    },
    fill: 'tozeroy',
  };

  // Couleur de la visée en fonction de si elle est possible ou non
  let h_lunette = alti_profil[0] + h_station;
  let h_prisme = alti_profil.at(-1) + h_signal;
  pente = (h_prisme - h_lunette) / distance_vise;

  // iteration pour tester si un point de la vise se trouve dans le MNS
  couleur_vise = 'rgb(0, 123, 255)';
  titre_profil = '<b>Visée possible<b>';
  for (const i of make_range(0, alti_profil.length - 1)) {
    alti = h_lunette + i * pente;
    if (alti <= alti_profil[i]) {
      couleur_vise = 'rgb(255, 71, 71)';
      titre_profil = '<b>Visée impossible<b>';
      break
    }
  };

  // profil de la vise
  var vise = {
    x: [dist_profil[0], dist_profil.at(-1)],
    y: [h_lunette, h_prisme],
    name: 'Visée',
    mode: 'lines+markers+text',
    text: ['Station', 'Point visé'],
    textposition: 'top',
    line: {
      color: couleur_vise,
      width: 2
    },
  };

  var data = [mns, vise];

  // mise en page du graph
  var layout = {
    title: {
      text: titre_profil,
      font: {
        size: 18,
        color: couleur_vise
      }
    },
    showlegend: true,
    xaxis: {
      title: 'Distance [m]',
      showgrid: false,
      zeroline: false
    },
    yaxis: {
      title: 'Altitude [m]',
      showline: false,
      range: [Math.min(...alti_profil) - 10, Math.max(...alti_profil) + 3 + Math.max(...[h_station, h_signal])]
    }
  };

  Plotly.newPlot('profil' + id_profil, data, layout);
}