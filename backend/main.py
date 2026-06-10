from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime, timedelta
from models.prestamo import Prestamo
from models.usuario import Usuario
from models.libro import Libro
from models.login import Login

from database import (
    administradores,
    libros,
    usuarios,
    prestamos
)

app = FastAPI()


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

    resultado = libros.insert_one(
        libro.model_dump()
    )

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
def editar_libro(id: str, libro: Libro):

    libros.update_one(
        {"_id": ObjectId(id)},
        {"$set": libro.model_dump()}
    )

    return {
        "mensaje": "Libro actualizado"
    }


@app.post("/usuarios")
def crear_usuario(usuario: Usuario):

    resultado = usuarios.insert_one(
        usuario.model_dump()
    )

    return {
        "mensaje": "Usuario creado",
        "id": str(resultado.inserted_id)
    }

@app.get("/usuarios")
def obtener_usuarios():

    datos = []

    for usuario in usuarios.find():

        datos.append({
            "id": str(usuario["_id"]),
            "nombre": usuario.get("nombre", ""),
            "matricula": usuario.get("matricula", ""),
            "carrera": usuario.get("carrera", ""),
            "correo": usuario.get("correo", ""),
            "telefono": usuario.get("telefono", ""),
            "tipo": usuario.get("tipo", "")
        })

    return datos

@app.get("/prestamos-detalle")
def prestamos_detalle():

    datos = []

    for prestamo in prestamos.find():

        if not prestamo.get("usuario_id") or not prestamo.get("libro_id"):
            continue

        usuario = usuarios.find_one({
            "_id": ObjectId(prestamo["usuario_id"])
        })

        libro = libros.find_one({
            "_id": ObjectId(prestamo["libro_id"])
        })

        if not usuario or not libro:
            continue

        datos.append({
            "usuario": usuario.get("nombre", ""),
            "tipo": usuario.get("tipo", "Sin tipo"),
            "libro": libro.get("titulo", ""),
            "fecha_prestamo": prestamo.get("fecha_prestamo", ""),
            "fecha_devolucion": prestamo.get("fecha_devolucion", "")
        })

    return datos

@app.get("/prestamos-usuario/{usuario_id}")
def prestamos_usuario(usuario_id: str):

    datos = []

    usuario = usuarios.find_one({
        "_id": ObjectId(usuario_id)
    })

    if not usuario:
        return []

    for prestamo in prestamos.find({
        "usuario_id": usuario_id
    }):

        libro = libros.find_one({
            "_id": ObjectId(prestamo["libro_id"])
        })

        if not libro:
            continue

        datos.append({
            "usuario": usuario["nombre"],
            "tipo": usuario.get("tipo", ""),
            "libro": libro["titulo"],
            "fecha_prestamo": prestamo["fecha_prestamo"],
            "fecha_devolucion": prestamo["fecha_devolucion"]
        })

    return datos

@app.get("/prestamos")
def obtener_prestamos():

    datos = []

    for prestamo in prestamos.find():

        datos.append({
            "id": str(prestamo["_id"]),
            "usuario_id": prestamo.get("usuario_id", ""),
            "libro_id": prestamo.get("libro_id", ""),
            "fecha_prestamo": prestamo.get("fecha_prestamo", ""),
            "fecha_devolucion": prestamo.get("fecha_devolucion", "")
        })

    return datos

@app.post("/prestamos")
def crear_prestamo(prestamo: Prestamo):

    prestamo_existente = prestamos.find_one({
        "libro_id": prestamo.libro_id
    })

    if prestamo_existente:
        return {
            "success": False,
            "mensaje": "Libro actualmente prestado"
        }

    fecha_prestamo = datetime.now()
    fecha_devolucion = fecha_prestamo + timedelta(days=7)

    nuevo_prestamo = {
        "usuario_id": prestamo.usuario_id,
        "libro_id": prestamo.libro_id,
        "fecha_prestamo": fecha_prestamo.strftime("%Y-%m-%d"),
        "fecha_devolucion": fecha_devolucion.strftime("%Y-%m-%d")
    }

    resultado = prestamos.insert_one(
        nuevo_prestamo
    )

    return {
        "success": True,
        "mensaje": "Préstamo creado",
        "id": str(resultado.inserted_id)
    }

@app.get("/estadisticas")
def estadisticas():

    total_libros = libros.count_documents({})
    total_usuarios = usuarios.count_documents({})
    total_prestamos = prestamos.count_documents({})

    disponibles = total_libros - total_prestamos

    return {
        "libros": total_libros,
        "usuarios": total_usuarios,
        "prestamos": total_prestamos,
        "disponibles": disponibles
    }


@app.get("/test-mongo")
def test_mongo():

    total = libros.count_documents({})

    return {
        "conexion": "ok",
        "libros": total
    }

    total = libros.count_documents({})

    return {
        "conexion": "ok",
        "libros": total
    }

@app.post("/login")
def login(datos: Login):

    usuario = usuarios.find_one({
        "matricula": datos.matricula,
        "password": datos.password
    })

    if not usuario:
        return {
            "success": False,
            "mensaje": "Matrícula o contraseña incorrectas"
        }

    return {
        "success": True,
        "id": str(usuario["_id"]),
        "nombre": usuario["nombre"],
        "tipo": usuario["tipo"]
    }