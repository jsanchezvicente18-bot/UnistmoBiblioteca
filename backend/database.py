from pymongo import MongoClient

uri = "mongodb+srv://biblioteca_admin:admin2005@bibliotecaweb.bfk1anc.mongodb.net/?appName=BibliotecaWeb"

print("DATABASE.PY CARGADO")

client = MongoClient(uri)

try:
    client.admin.command("ping")
    print("MONGO CONECTADO")
except Exception as e:
    print("ERROR MONGO:", e)

db = client["biblioteca"]

administradores = db["administradores"]
usuarios = db["usuarios"]
libros = db["libros"]
prestamos = db["prestamos"]
configuracion = db["configuracion"]
categorias = db["categorias"]
mensajes_admin = db["mensajes_admin"]
reportes_error = db["reportes_error"]
notificaciones = db["notificaciones"]
favoritos = db["favoritos"]
categorias_buscadas = db["categorias_buscadas"]