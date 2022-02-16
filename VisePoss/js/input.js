// mise a jour de la distance de recherche
function updateDistance(slider) {
  range = parseInt(slider.value);
  $('#text_distance').text(range + ' m');
  localStorage.setItem('range', range);
}

// mise à jour de la hauteur de station
function updateHStation(input) {
  h_station = parseFloat(input.value);
  localStorage.setItem('h_station', h_station);
}

// mise à jour de la hauteur du signal
function updateHSignal(input) {
  h_signal = parseFloat(input.value);
  localStorage.setItem('h_signal', h_signal);
}

// introduire le numéro de la station
function noStation(input) {
  num_station = input.value;
  console.log("oui")
}