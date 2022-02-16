#     #####################################################################################
#     *************************************************************************************

#     PROJET DE SYSINFGEO3 - SEMESTRE D'AUTOMNE 2021-2022 - HEIG-VD
#     GROUPE: PELLAUD Pierre & SMOLIK Marin
#     PROFESSEURS: MALTA E SOUSA Stéphane & INGENSAND Jens
#     DATE: le 22 Janvier 2022

#     *************************************************************************************
#     #####################################################################################

#     *************************************************************************************
#     INTRODUCTION
#     *************************************************************************************
#     Ce fichier python sert à demander au serveur quelles sont les département autour d'un
#     département selectionné. Le numéro du département arrive via l'URL et le serveur
#     envoi une requete SQL à la base de données postgreSQL.
#     Se reférer à la maquette powerpoint ci-jointe.

# Import des modules
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
import json
import psycopg2

# Nom du port ouvert
hostName = "localhost"
hostPort = 8080


class MyServer(BaseHTTPRequestHandler):

    # Connexion à la base de données
    try:
        conn = psycopg2.connect(
            "dbname='sig3_2022' user='www' host='localhost' password='www' port=5432"
        )
        cursor = conn.cursor()
    except:
        print("I am unable to connect to the database")

    # Contient les headers standards pour répondre du JSON
    def _set_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    # GET
    def do_GET(self):
        # Récupère la valeur du département depuis l'URL
        ma_variableBrute = self.path
        ma_variableClean = ma_variableBrute[2:]

        # Execution de la requête SQL
        self.cursor.execute(
            """SELECT code_insee FROM bnr.departement_3 WHERE st_touches (bnr.departement_3.geom,
			(SELECT bnr.departement_3.geom FROM bnr.departement_3 WHERE code_insee='"""
            + ma_variableClean
            + "'))"
        )

        self.data = self.cursor.fetchall()

        self.send_response(200)
        self._set_headers()
        # json.dumps converti le dictionnaire python en JSON
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
