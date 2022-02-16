// raccourci pour changement de distance : - -> diminuer la distance, + -> augmenter la distance
$(document).keypress(function (event) {
  // detection de la touche pressee
  let key = (event.keyCode ? event.keyCode : event.which);
  key = String.fromCharCode(key);
  let slider = document.getElementById('slider_distance');
  if (key === '-' && range !== 25) {
    range = parseInt(slider.value) - 25;
    slider.value = range;
    $('#text_distance').text(range + ' m');
  } else if (key === '+' && range !== 2500) {
    range = parseInt(slider.value) + 25;
    slider.value = range;
    $('#text_distance').text(range + ' m');
  }
})