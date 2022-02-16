#!/usr/bin/python3

from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import Lib_Web_Topo as ws


hostName = ""
hostPort = 8000


class MyServer(BaseHTTPRequestHandler):
    def _set_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    def do_GET(self):
        self.send_response(200)
        self._set_headers()
        if self.path[1] == "?":
            print("\n\n-----------------------------")
            print(self.path)
            URLparams = self.path.split("/?")[1]
            lat_str = URLparams.split("&")[0]
            lat = float(lat_str.split("lat=")[1])
            lon_str = URLparams.split("&")[1]
            lon = float(lon_str.split("lon=")[1])
            astre_str = URLparams.split("&")[2]
            astre = astre_str.split("astre=")[1]
            print("LATITUDE lieu:", lat, "  LONGITUDE lieu:", lon, "  ASTRE:", astre)
            self.wfile.write(
                bytes(
                    "LES PARAMETRES (lieu) SONT: "
                    + " lat="
                    + str(lat)
                    + " lon="
                    + str(lon)
                    + " astre="
                    + astre,
                    "utf-8",
                )
            )
            self.Process_PLANETES(astre, lat, lon)

    def Process_PLANETES(self, astre, lat, lon):
        """ "
        Fonction principale pour la LUNE
            input: lat,lon du lieu (float), astre (string)
            return: None
        """

        alti, azi, posITRS, altiLieu = ws.getAltiAziFromWeb_PLANETES(lat, lon, astre)
        print("\nVISUALISATION DANS CESIUM ->")
        print(alti, azi, posITRS, altiLieu)

        # ellipsoide GRS80
        a = 6378137.0
        e = 0.08181919132

        # Passage de coordonnees XYZ -> lon,lat,h WGS84
        lon_obj, lat_obj, h_obj = ws.cart_2_elips(
            posITRS[0][0], posITRS[1][0], posITRS[2][0], a, e
        )
        print("\nIMPLANTATIONS WGS84 ellips. DANS CESIUM ->")
        print(lat_obj, lon_obj, h_obj)

        # Suivi de calcul
        print("-----------------------------\n\n")
        self.wfile.write(bytes("\n\nCALCUL EN COURS", "utf-8"))
        self.wfile.write(bytes("\n.", "utf-8"))
        self.wfile.write(bytes(".", "utf-8"))
        self.wfile.write(bytes(".", "utf-8"))
        self.wfile.write(
            bytes(
                "\n\nRESULTATS: "
                + " angle vertical="
                + str(alti)
                + " azimut="
                + str(azi),
                "utf-8",
            )
        )
        self.wfile.write(
            bytes(
                "\nCoordonnées implantation CESIUM WGS84 ellips.: "
                + str(lat_obj)
                + "  "
                + str(lon_obj)
                + "  "
                + str(h_obj),
                "utf-8",
            )
        )
        self.wfile.write(bytes("\n/////////\n", "utf-8"))
        self.wfile.write(
            bytes(
                str(alti)
                + ";"
                + str(azi)
                + ";"
                + str(lat_obj)
                + ";"
                + str(lon_obj)
                + ";"
                + str(h_obj)
                + ";"
                + str(altiLieu),
                "utf-8",
            )
        )


# Serveur
myServer = HTTPServer((hostName, hostPort), MyServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))
