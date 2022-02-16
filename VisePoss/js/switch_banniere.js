// changer la bannière lors du clic
function changeBanner() {
    let class_banniere = $('#banniere').attr('class');
    if (class_banniere.includes("banniere_leica")) {
        $("#banniere").removeClass("banniere_leica");
        $("#banniere").addClass("banniere_trimble");
        localStorage.setItem('banniere', 'banniere_trimble');
    } else {
        $("#banniere").removeClass("banniere_trimble");
        $("#banniere").addClass("banniere_leica");
        localStorage.setItem('banniere', 'banniere_leica');
    }
}