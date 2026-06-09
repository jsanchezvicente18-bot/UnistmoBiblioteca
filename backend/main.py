from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime, timedelta
from models.prestamo import Prestamo
from database import administradores, libros
from models.usuario import Usuario
from models.libro import Libro



app = FastAPI()

# Permitir conexión desde Angular
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

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
            "autor": libro.get("autor", ""),
            "categoria": libro.get("categoria", ""),
            "isbn": libro.get("isbn", ""),
            "existencias": libro.get("existencias", 0)
        })

    return datos


@app.post("/libros")
def agregar_libro(libro: Libro):

    resultado = libros.insert_one(libro.model_dump())

    return {
        "mensaje": "Libro agregado",
        "id": str(resultado.inserted_id)
    }


@app.delete("/libros/{id}")
def eliminar_libro(id: str):

    libros.delete_one(
        {"_id": ObjectId(id)}
    )

    return {
        "mensaje": "Libro eliminado"
    }


@app.put("/libros/{id}")
def editar_libro(id: str, datos: dict):

    libros.update_one(
        {"_id": ObjectId(id)},
        {"$set": datos}
    )

    return {
        "mensaje": "Libro actualizado"
    }


@app.get("/usuarios")
def obtener_usuarios():
    return []

@app.post("/usuarios")
def crear_usuario(usuario: Usuario):
    return usuario

@app.get("/prestamos")
def obtener_prestamos():
    return []

@app.post("/prestamos")
def crear_prestamo(prestamo: Prestamo):

    fecha_prestamo = datetime.now()
    fecha_devolucion = fecha_prestamo + timedelta(days=7)

    return {
        "usuario_id": prestamo.usuario_id,
        "libro_id": prestamo.libro_id,
        "fecha_prestamo": fecha_prestamo.strftime("%Y-%m-%d"),
        "fecha_devolucion": fecha_devolucion.strftime("%Y-%m-%d")
    }

@app.get("/estadisticas")
def estadisticas():

    return {
        "libros": 0,
        "usuarios": 0,
        "prestamos": 0
    }