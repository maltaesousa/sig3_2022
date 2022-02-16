// fonction de changement de la banniere selon préférence utilisateur
function changeBannerOnLoad() {
    let banniere = localStorage.getItem('banniere')
    if (banniere.includes("banniere_leica")) {
        $("#banniere").removeClass("banniere_trimble");
        $("#banniere").addClass("banniere_leica");
    } else {
        $("#banniere").removeClass("banniere_leica");
        $("#banniere").addClass("banniere_trimble");
    }
}

// créer les variables utilisateurs lors du premier chargement de la page
function setUserVariables() {
    if (localStorage.length === 0) {
        localStorage.setItem('banniere', 'banniere_leica');
        localStorage.setItem('num_station', 1);
    }
}