#!/usr/bin/python3

import socket
from http.server import BaseHTTPRequestHandler, HTTPServer
import time
from datetime import datetime
import json
import psycopg2

hostName = "localhost"
hostPort = 8000


class MyServer(BaseHTTPRequestHandler):

    # Connexion à la base de données
    data = {}
    try:
        conn = psycopg2.connect(
            "dbname='viseposs' user='postgres' host='localhost' password='postgres'"
        )
        cursor = conn.cursor()
    except:
        print("Impossible de se connecter à la base de données")

    # Contient les headers standards pour répondre du JSON
    def _set_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        self.send_header("Content-Type", "application/json")
        self.send_header("Access-Control-Allow-Methods", "GET, OPTIONS, POST")
        self.send_header("Access-Control-Allow-Headers", "X-Requested-With")
        self.send_header("Access-Control-Allow-Headers", "Content-Type")
        self.end_headers()

    # 	GET
    def do_GET(self):
        # Extraire les coordonnées de la station et du point visé
        t1 = datetime.now()
        values = self.path.replace("/?", "").split("&")
        e_sta, n_sta = values[1], values[2]
        print("Coordonnée de la station : ", e_sta, n_sta)

        # Test si la requete est une demande de profil ou d'une altitude unique
        if values[0] == "getProfil":
            e_vise, n_vise = values[3], values[4]
            dist_profil = round(
                (
                    (float(e_sta) - float(e_vise)) ** 2
                    + (float(n_sta) - float(n_vise)) ** 2
                )
                ** 0.5,
                1,
            )
            print("Coordonnée du point visé : ", e_vise, n_vise)
            print("Distance : ", dist_profil)

            # Exécution du SQL dans la BD
            self.cursor.execute(
                """WITH line AS
										-- From an arbitrary line
										(SELECT 'SRID=2056;LINESTRING ("""
                + e_sta
                + " "
                + n_sta
                + ","
                + e_vise
                + " "
                + n_vise
                + """)'::geometry AS geom),
										linemesure AS
										-- Add a mesure dimension to extract steps
										(SELECT ST_AddMeasure(line.geom, 0, ST_Length(line.geom)) as linem,
												generate_series(0, ST_Length(line.geom)::int, 1) as i
										FROM line),
										points2d AS
										(SELECT ST_GeometryN(ST_LocateAlong(linem, i), 1) AS geom FROM linemesure),
										cells AS
										-- Get DEM elevation for each
										(SELECT p.geom AS geom, ST_Value(data.mns_raster.rast, 1, p.geom) AS val
										FROM data.mns_raster, points2d p
										WHERE ST_Intersects(data.mns_raster.rast, p.geom)),
										-- Instantiate 3D points
										points_profil AS
										(SELECT val AS pt FROM cells)
									-- Build 3D line from 3D points
									SELECT pt FROM points_profil;"""
            )
        else:
            # Exécution du SQL dans la BD
            self.cursor.execute(
                f"SELECT st_value(data.mns_raster.rast, st_setsrid(st_makepoint({e_sta},{n_sta}), 2056)) from data.mns_raster"
            )
        self.data = self.cursor.fetchall()

        self.send_response(200)
        self._set_headers()
        t2 = datetime.now()
        print("Temps de réponse : ", round((t2 - t1).total_seconds(), 1), "secondes\n")
        # json.dumps converti le dictionnaire python en JSON
        self.wfile.write(bytes(json.dumps(self.data), "utf-8"))


myServer = HTTPServer((hostName, hostPort), MyServer)
print(time.asctime(), "Server Starts - %s:%s" % (hostName, hostPort))

try:
    myServer.serve_forever()
except KeyboardInterrupt:
    pass

myServer.server_close()
print(time.asctime(), "Server Stops - %s:%s" % (hostName, hostPort))
