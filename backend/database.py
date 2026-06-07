from pymongo import MongoClient

uri = "mongodb+srv://bibliotecaUser:BibliotecaUser@cluster0.tmnecpk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

client = MongoClient(uri)

db = client["biblioteca"]

administradores = db["administradores"]
usuarios = db["usuarios"]
libros = db["libros"]
prestamos = db["prestamos"]