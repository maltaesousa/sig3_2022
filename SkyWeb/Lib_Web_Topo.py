from bs4 import BeautifulSoup
import requests
import json
import numpy as np
import math
import time


def getAltiAziFromWeb_PLANETES(lat, lon, astre):

    """
    INPUT:
        lat: float
        lon: float
        astre: str, nom de la planète

    RETURNS:
        alti: altitude (ascension dans le ciel) de l'astre en deg
        azi: azimut en deg

    commentaire: altitude fixée à 0 (ordre de grandeur trop faible pour prendre en compte)
    """

    # distance schématique pour visualisation
    d = 384000000

    # index de recherche en webscraping pour chaque planète
    if astre == "Mercure":
        index_alti = 5
        index_azi = 135
    if astre == "Venus":
        index_alti = 6
        index_azi = 136
    if astre == "Mars":
        index_alti = 7
        index_azi = 137
    if astre == "Jupiter":
        index_alti = 8
        index_azi = 138
    if astre == "Saturne":
        index_alti = 9
        index_azi = 139
    if astre == "Uranus":
        index_alti = 10
        index_azi = 140
    if astre == "Neptune":
        index_alti = 11
        index_azi = 141
    if astre == "Pluton":
        index_alti = 12
        index_azi = 142

    if astre == "Lune":
        # parser le code source HTML enregistré dans raw_html
        page = requests.get(
            "https://heavens-above.com/moon.aspx?lat={:f}&lng={:f}&loc=Unspecified&alt=0&tz=UCT".format(
                lat, lon
            ),
            verify=False,
        )

        soup = BeautifulSoup(page.content, "html.parser")
        # print(soup.prettify())

        # Get le texte de l'altitude sous le tag "span" index no 5
        alti = soup.find_all("span")[5].get_text()
        alti = float(alti[:-1])

        # Get le texte de l'altitude sous le tag "span" index no 5
        azi = soup.find_all("span")[6].get_text()
        azi = float(azi[:-7])

        # coord topo avec distance approx.
        x_topo_lune = d * np.cos(azi * np.pi / 180.0)
        y_topo_lune = d * np.sin(azi * np.pi / 180.0)
        z_topo_lune = d * np.sin(alti * np.pi / 180.0)

        posTOPO = np.array([[x_topo_lune], [y_topo_lune], [z_topo_lune]])

        posITRS = posTopo2ITRS(lat, lon, posTOPO)

    else:
        page = requests.get(
            "https://www.heavens-above.com/PlanetSummary.aspx?lat={:f}&lng={:f}&loc=Unspecified&alt=400&tz=UCT".format(
                lat, lon
            ), verify=False
        )

        soup = BeautifulSoup(page.content, "html.parser")
        # print(soup.prettify())

        # Get le texte de l'altitude sous le tag "span" index no 5
        alti = soup.find_all("span")[index_alti].get_text()
        alti = float(alti[:-1])

        # Get le texte de l'altitude sous le tag "td" index no 137
        azi = soup.find_all("td")[index_azi].get_text()
        azi = float(azi[:-1])

        # coord topo avec distance approx.
        x_topo_astre = d * np.cos(azi * np.pi / 180.0)
        y_topo_astre = d * np.sin(azi * np.pi / 180.0)
        z_topo_astre = d * np.sin(alti * np.pi / 180.0)

        posTOPO = np.array([[x_topo_astre], [y_topo_astre], [z_topo_astre]])

        posITRS = posTopo2ITRS(lat, lon, posTOPO)

        # Obtenir altitude du lieu pour positionner la caméra
    altiLieu = get_elevation(lat, lon)
    time.sleep(0.1)

    return alti, azi, posITRS, altiLieu


def get_elevation(lat, long):
    # Fonction qui obtient l'altitude d'un point sur terre avec sa longitude et latitude
    # API "open-elevation" avec request GET, précision +- 2m (suffisant pour régler la vue de la caméra)
    # Tests ok et validation tout autour du globe !
    url = "https://api.opentopodata.org/v1/test-dataset?locations={:f},{:f}".format(
        long, lat
    )
    payload = {}
    headers = {}
    response = requests.request("GET", url, headers=headers, data=payload, verify=False)
    elev = json.loads(response.text)["results"][0]["elevation"]

    return elev + 100


def posTopo2ITRS(lat0, lon0, posTOPO):

    """
    INPUT:
        lat0: latitude du lieu
        lon0: longitude du lieu
        posTOPO: vecteur numpy array de l'astre x,y,z TOPOCENTRIQUE'

    RETURNS:
        posITRS: vecteur numpy array de l'astre x,y,z ITRS '
    """

    pos0ITRS = np.array([elips_2_cart(lon0, lat0, 0, 6378137.0, 0.08181919104281517)]).T
    lat = lat0 * np.pi / 180.0
    lon = lon0 * np.pi / 180.0
    T = np.array(
        [
            [-np.sin(lat) * np.cos(lon), -np.sin(lon), np.cos(lat) * np.cos(lon)],
            [-np.sin(lat) * np.sin(lon), np.cos(lon), np.cos(lat) * np.sin(lon)],
            [np.cos(lat), 0, np.sin(lat)],
        ]
    )
    posITRS = pos0ITRS + T @ posTOPO

    return posITRS


def elips_2_cart(lambda_deg, phi_deg, h, a, e):

    lambda_rad = lambda_deg * np.pi / 180.0
    phi_rad = phi_deg * np.pi / 180.0
    Rn = a / math.sqrt(1 - (e**2 * np.sin(phi_rad) ** 2))

    x = (Rn + h) * np.cos(phi_rad) * np.cos(lambda_rad)
    y = (Rn + h) * np.cos(phi_rad) * np.sin(lambda_rad)
    z = ((Rn * (1 - e**2)) + h) * np.sin(phi_rad)

    return x, y, z


def cart_2_elips(x, y, z, a, e):

    lambda_rad = np.arctan2(y, x)
    hi = 0.0
    hi_1 = 1.0
    Rni = 1.0

    while np.abs(hi - hi_1) > 0.000001:
        hi_1 = hi
        phii = np.arctan2(
            z, math.sqrt(x**2 + y**2) * (1 - ((Rni / (Rni + hi)) * e**2))
        )
        Rni = a / math.sqrt(1 - (e**2 * np.sin(phii) ** 2))
        hi = (math.sqrt(x**2 + y**2) / np.cos(phii)) - Rni

    lambda_deg = lambda_rad * 180.0 / np.pi
    phi_deg = phii * 180.0 / np.pi

    return lambda_deg, phi_deg, hi


# print(getAltiAziFromWeb_PLANETES(46.5,6.5,"Mercure"))
