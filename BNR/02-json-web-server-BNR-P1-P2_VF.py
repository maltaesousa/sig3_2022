#     #####################################################################################
#     *************************************************************************************

#     PROJET DE SYSINFGEO3 - SEMESTRE D'AUTOMNE 2021-2022 - HEIG-VD
#     GROUPE: PELLAUD Pierre & SMOLIK Marin
#     PROFESSEURS: MALTA E SOUSA Stéphane & INGENSAND Jens
#     DATE: le 16 Janvier 2022

#     *************************************************************************************
#     #####################################################################################

#     *************************************************************************************
#     INTRODUCTION
#     *************************************************************************************
#     Ce fichier python sert à transférer les bases J1 entre les pages 1 et 2 de la BNR.
#     Il stock l'historique des bases J1 selectionnées dans son historique tant qu'il tourne.
#     Se reférer à la maquette powerpoint ci-jointe.

# Import des modules
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import json

# Nom du port ouvert
hostName = "localhost"
hostPort = 8000

# Définition du serveur
class MyServer(BaseHTTPRequestHandler):
    # Ceci est un dictionnaire Python qui stock les bases choisies pour chaque parties
    data = {"Bases_J1": []}

    # Contient les headers standards pour répondre du JSON
    def _set_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    # Nécessaire pour le POST.
    def do_OPTIONS(self):
        self.send_response(200)
        self._set_headers()

    # GET
    def do_GET(self):
        self.send_response(200)
        self._set_headers()
        # json.dumps converti le dictionnaire python en JSON
        self.wfile.write(bytes(json.dumps(self.data), "utf-8"))

    # POST pour envoyer des données au serveur
    def do_POST(self):
        content_length = int(
            self.headers["Content-Length"]
        )  # <--- Obtient la longueur de la donnée
        post_data = self.rfile.read(content_length)  # <--- Obtient la donnée elle même

        print("Le serveur a reçu un POST!", self.path, post_data)

        # On lit le JSON et on ajoute l'objet au tableau des bases
        new_bases = json.loads(post_data.decode("utf8"))
        self.data["Bases_J1"].append(new_bases)

        self.send_response(201)
        self._set_headers()
        self.wfile.write(bytes(json.dumps(self.data), "utf-8"))


myServer = HTTPServer((hostName, hostPort), MyServer)

# affiche l'activité du serveur
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))
