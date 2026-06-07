from fastapi import FastAPI
from database import administradores, libros

app = FastAPI()

@app.get("/")
def inicio():
    return {"mensaje": "Biblioteca UNISTMO"}

@app.get("/admin")
def admin():
    datos = list(administradores.find({}, {"_id": 0}))
    return datos

@app.get("/libros")
def obtener_libros():

    datos = []

    for libro in libros.find():

        datos.append({
            "id": str(libro["_id"]),
            "titulo": libro.get("titulo", ""),
            "autor": libro.get("autor", "")
        })

    return datos