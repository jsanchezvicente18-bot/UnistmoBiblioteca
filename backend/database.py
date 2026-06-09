from pymongo import MongoClient

uri= "mongodb+srv://biblioteca_admin:admin2005@bibliotecaweb.bfk1anc.mongodb.net/?appName=BibliotecaWeb"
client = MongoClient(uri)

db = client["biblioteca"]

administradores = db["administradores"]
usuarios = db["usuarios"]
libros = db["libros"]
prestamos = db["prestamos"]
configuracion = db["configuracion"]
categorias = db["categorias"]                                       