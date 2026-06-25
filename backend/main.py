from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from bson import ObjectId
from datetime import datetime, timedelta
from pydantic import BaseModel

from models.prestamo import Prestamo
from models.usuario import Usuario
from models.libro import Libro
from models.login import Login
from models.recuperar import SolicitarRecuperacion

from database import (
    administradores,
    libros,
    usuarios,
    prestamos,
    mensajes_admin,
    reportes_error,
    notificaciones,
    favoritos,
    categorias_buscadas
)

app = FastAPI()


class CambiarPasswordRecuperacion(BaseModel):
    correo: str
    nueva_password: str


class CambiarPasswordPerfil(BaseModel):
    passwordActual: str
    nuevaPassword: str


class ActualizarUsuario(BaseModel):
    nombre: str
    correo: str
    carrera: str
    fotoPerfil: str = ""


class MensajeAdmin(BaseModel):
    usuario_id: str = ""
    nombre: str
    correo: str = ""
    asunto: str = ""
    mensaje: str


class ReporteError(BaseModel):
    usuario_id: str = ""
    nombre: str = ""
    correo: str = ""
    modulo: str = ""
    descripcion: str


class Favorito(BaseModel):
    usuario_id: str
    libro_id: str


class CategoriaBuscada(BaseModel):
    categoria: str


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def convertir_id(documento):
    documento["id"] = str(documento["_id"])
    del documento["_id"]
    return documento


@app.get("/")
def inicio():
    return {"mensaje": "Biblioteca UNISTMO"}


@app.get("/admin")
def admin():
    return list(administradores.find({}, {"_id": 0}))


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
        "success": True,
        "mensaje": "Libro agregado",
        "id": str(resultado.inserted_id)
    }


@app.put("/libros/{id}")
def editar_libro(id: str, libro: Libro):
    libros.update_one(
        {"_id": ObjectId(id)},
        {"$set": libro.model_dump()}
    )

    return {
        "success": True,
        "mensaje": "Libro actualizado"
    }


@app.delete("/libros/{id}")
def eliminar_libro(id: str):
    libros.delete_one({"_id": ObjectId(id)})

    return {
        "success": True,
        "mensaje": "Libro eliminado"
    }


@app.post("/usuarios")
def crear_usuario(usuario: Usuario):
    existe = usuarios.find_one({"matricula": usuario.matricula})

    if existe:
        return {
            "success": False,
            "mensaje": "Ya existe un usuario con esa matrícula"
        }

    datos = usuario.model_dump()
    datos["fechaRegistro"] = datetime.now().strftime("%Y-%m-%d")

    resultado = usuarios.insert_one(datos)

    return {
        "success": True,
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


@app.put("/usuarios/{usuario_id}")
def actualizar_usuario(usuario_id: str, datos: ActualizarUsuario):
    usuarios.update_one(
        {"_id": ObjectId(usuario_id)},
        {
            "$set": {
                "nombre": datos.nombre,
                "correo": datos.correo,
                "carrera": datos.carrera,
                "fotoPerfil": datos.fotoPerfil
            }
        }
    )

    return {
        "success": True,
        "mensaje": "Usuario actualizado correctamente"
    }


@app.put("/usuarios/{usuario_id}/password")
def cambiar_password_perfil(usuario_id: str, datos: CambiarPasswordPerfil):
    usuario = usuarios.find_one({"_id": ObjectId(usuario_id)})

    if not usuario:
        return {
            "success": False,
            "mensaje": "Usuario no encontrado"
        }

    if usuario.get("password") != datos.passwordActual:
        return {
            "success": False,
            "mensaje": "La contraseña actual no coincide"
        }

    usuarios.update_one(
        {"_id": ObjectId(usuario_id)},
        {"$set": {"password": datos.nuevaPassword}}
    )

    return {
        "success": True,
        "mensaje": "Contraseña actualizada correctamente"
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
        "nombre": usuario.get("nombre", ""),
        "tipo": usuario.get("tipo", ""),
        "correo": usuario.get("correo", ""),
        "matricula": usuario.get("matricula", ""),
        "carrera": usuario.get("carrera", ""),
        "fechaRegistro": usuario.get("fechaRegistro", ""),
        "fotoPerfil": usuario.get("fotoPerfil", "")
    }


@app.post("/recuperar-password")
def recuperar_password(datos: SolicitarRecuperacion):
    usuario = usuarios.find_one({"correo": datos.correo})

    if not usuario:
        return {
            "success": False,
            "mensaje": "No existe un usuario con ese correo"
        }

    return {
        "success": True,
        "mensaje": "Usuario encontrado. Puede cambiar su contraseña"
    }


@app.put("/cambiar-password")
def cambiar_password_recuperacion(datos: CambiarPasswordRecuperacion):
    usuario = usuarios.find_one({"correo": datos.correo})

    if not usuario:
        return {
            "success": False,
            "mensaje": "Usuario no encontrado"
        }

    usuarios.update_one(
        {"correo": datos.correo},
        {"$set": {"password": datos.nueva_password}}
    )

    return {
        "success": True,
        "mensaje": "Contraseña actualizada correctamente"
    }


@app.get("/prestamos")
def obtener_prestamos():
    datos = []

    for prestamo in prestamos.find():
        datos.append({
            "id": str(prestamo["_id"]),
            "usuario_id": prestamo.get("usuario_id", ""),
            "libro_id": prestamo.get("libro_id", ""),
            "fecha_prestamo": prestamo.get("fecha_prestamo", ""),
            "fecha_devolucion": prestamo.get("fecha_devolucion", ""),
            "estado": prestamo.get("estado", "Activo")
        })

    return datos


@app.post("/prestamos")
def crear_prestamo(prestamo: Prestamo):
    libro = libros.find_one({"_id": ObjectId(prestamo.libro_id)})

    if not libro:
        return {
            "success": False,
            "mensaje": "Libro no encontrado"
        }

    if libro.get("existencias", 0) <= 0:
        return {
            "success": False,
            "mensaje": "Este libro está agotado"
        }

    prestamo_existente = prestamos.find_one({
        "usuario_id": prestamo.usuario_id,
        "libro_id": prestamo.libro_id,
        "estado": "Activo"
    })

    if prestamo_existente:
        return {
            "success": False,
            "mensaje": "Ya tienes este libro solicitado"
        }

    fecha_prestamo = datetime.now()
    fecha_devolucion = fecha_prestamo + timedelta(days=7)

    nuevo_prestamo = {
        "usuario_id": prestamo.usuario_id,
        "libro_id": prestamo.libro_id,
        "fecha_prestamo": fecha_prestamo.strftime("%Y-%m-%d"),
        "fecha_devolucion": fecha_devolucion.strftime("%Y-%m-%d"),
        "estado": "Activo"
    }

    resultado = prestamos.insert_one(nuevo_prestamo)

    libros.update_one(
        {"_id": ObjectId(prestamo.libro_id)},
        {"$inc": {"existencias": -1}}
    )

    notificaciones.insert_one({
        "usuario_id": prestamo.usuario_id,
        "mensaje": "Se registró un préstamo nuevo. Fecha de devolución: " + fecha_devolucion.strftime("%Y-%m-%d"),
        "fecha": datetime.now().strftime("%Y-%m-%d %H:%M"),
        "leida": False
    })

    return {
        "success": True,
        "mensaje": "Préstamo solicitado correctamente",
        "id": str(resultado.inserted_id)
    }


@app.get("/prestamos-detalle")
def prestamos_detalle():
    datos = []

    for prestamo in prestamos.find():
        if not prestamo.get("usuario_id") or not prestamo.get("libro_id"):
            continue

        usuario = usuarios.find_one({"_id": ObjectId(prestamo["usuario_id"])})
        libro = libros.find_one({"_id": ObjectId(prestamo["libro_id"])})

        if not usuario or not libro:
            continue

        datos.append({
            "id": str(prestamo["_id"]),
            "usuario": usuario.get("nombre", ""),
            "tipo": usuario.get("tipo", ""),
            "libro": libro.get("titulo", ""),
            "fecha_prestamo": prestamo.get("fecha_prestamo", ""),
            "fecha_devolucion": prestamo.get("fecha_devolucion", ""),
            "estado": prestamo.get("estado", "Activo")
        })

    return datos


@app.get("/prestamos-usuario/{usuario_id}")
def prestamos_usuario(usuario_id: str):
    datos = []

    usuario = usuarios.find_one({"_id": ObjectId(usuario_id)})

    if not usuario:
        return []

    for prestamo in prestamos.find({"usuario_id": usuario_id}):
        libro = libros.find_one({"_id": ObjectId(prestamo["libro_id"])})

        if not libro:
            continue

        datos.append({
            "id": str(prestamo["_id"]),
            "usuario": usuario.get("nombre", ""),
            "tipo": usuario.get("tipo", ""),
            "libro": libro.get("titulo", ""),
            "fecha_prestamo": prestamo.get("fecha_prestamo", ""),
            "fecha_devolucion": prestamo.get("fecha_devolucion", ""),
            "estado": prestamo.get("estado", "Activo")
        })

    return datos


@app.put("/prestamos/{prestamo_id}/devolver")
def devolver_prestamo(prestamo_id: str):
    prestamo = prestamos.find_one({"_id": ObjectId(prestamo_id)})

    if not prestamo:
        return {
            "success": False,
            "mensaje": "Préstamo no encontrado"
        }

    if prestamo.get("estado") == "Devuelto":
        return {
            "success": False,
            "mensaje": "Este préstamo ya fue devuelto"
        }

    prestamos.update_one(
        {"_id": ObjectId(prestamo_id)},
        {"$set": {"estado": "Devuelto"}}
    )

    libros.update_one(
        {"_id": ObjectId(prestamo["libro_id"])},
        {"$inc": {"existencias": 1}}
    )

    return {
        "success": True,
        "mensaje": "Libro devuelto correctamente"
    }


@app.post("/favoritos")
def agregar_favorito(datos: Favorito):
    existe = favoritos.find_one({
        "usuario_id": datos.usuario_id,
        "libro_id": datos.libro_id
    })

    if existe:
        return {
            "success": False,
            "mensaje": "Este libro ya está en favoritos"
        }

    favoritos.insert_one({
        "usuario_id": datos.usuario_id,
        "libro_id": datos.libro_id,
        "fecha": datetime.now().strftime("%Y-%m-%d %H:%M")
    })

    return {
        "success": True,
        "mensaje": "Libro agregado a favoritos"
    }


@app.get("/favoritos/{usuario_id}")
def obtener_favoritos(usuario_id: str):
    datos = []

    for favorito in favoritos.find({"usuario_id": usuario_id}):
        libro = libros.find_one({"_id": ObjectId(favorito["libro_id"])})

        if not libro:
            continue

        datos.append({
            "id": str(favorito["_id"]),
            "libro_id": str(libro["_id"]),
            "titulo": libro.get("titulo", ""),
            "autor": libro.get("autor", ""),
            "categoria": libro.get("categoria", ""),
            "isbn": libro.get("isbn", ""),
            "existencias": libro.get("existencias", 0)
        })

    return datos


@app.delete("/favoritos/{usuario_id}/{libro_id}")
def eliminar_favorito(usuario_id: str, libro_id: str):
    favoritos.delete_one({
        "usuario_id": usuario_id,
        "libro_id": libro_id
    })

    return {
        "success": True,
        "mensaje": "Favorito eliminado"
    }


@app.post("/categorias-buscadas")
def guardar_categoria_buscada(datos: CategoriaBuscada):
    categorias_buscadas.update_one(
        {"categoria": datos.categoria},
        {
            "$inc": {"busquedas": 1},
            "$set": {"ultima_busqueda": datetime.now().strftime("%Y-%m-%d %H:%M")}
        },
        upsert=True
    )

    return {
        "success": True,
        "mensaje": "Búsqueda guardada"
    }


@app.get("/categorias-destacadas")
def obtener_categorias_destacadas():
    datos = []

    for categoria in categorias_buscadas.find().sort("busquedas", -1).limit(6):
        datos.append({
            "categoria": categoria.get("categoria", ""),
            "busquedas": categoria.get("busquedas", 0)
        })

    if len(datos) == 0:
        return [
            {"categoria": "Programación", "busquedas": 0},
            {"categoria": "Bases de Datos", "busquedas": 0},
            {"categoria": "Redes", "busquedas": 0},
            {"categoria": "IA", "busquedas": 0},
            {"categoria": "Matemáticas", "busquedas": 0},
            {"categoria": "Literatura", "busquedas": 0}
        ]

    return datos


@app.post("/contactar-admin")
def contactar_admin(datos: MensajeAdmin):
    mensajes_admin.insert_one({
        "usuario_id": datos.usuario_id,
        "nombre": datos.nombre,
        "correo": datos.correo,
        "asunto": datos.asunto,
        "mensaje": datos.mensaje,
        "fecha": datetime.now().strftime("%Y-%m-%d %H:%M")
    })

    return {
        "success": True,
        "mensaje": "Mensaje enviado al administrador"
    }


@app.get("/mensajes-admin")
def obtener_mensajes_admin():
    datos = []

    for mensaje in mensajes_admin.find().sort("_id", -1):
        datos.append({
            "id": str(mensaje["_id"]),
            "usuario_id": mensaje.get("usuario_id", ""),
            "nombre": mensaje.get("nombre", ""),
            "correo": mensaje.get("correo", ""),
            "asunto": mensaje.get("asunto", ""),
            "mensaje": mensaje.get("mensaje", ""),
            "fecha": mensaje.get("fecha", "")
        })

    return datos


@app.post("/reportar-error")
def reportar_error(datos: ReporteError):
    reportes_error.insert_one({
        "usuario_id": datos.usuario_id,
        "nombre": datos.nombre,
        "correo": datos.correo,
        "modulo": datos.modulo,
        "descripcion": datos.descripcion,
        "fecha": datetime.now().strftime("%Y-%m-%d %H:%M")
    })

    return {
        "success": True,
        "mensaje": "Reporte enviado correctamente"
    }


@app.get("/reportes-error")
def obtener_reportes_error():
    datos = []

    for reporte in reportes_error.find().sort("_id", -1):
        datos.append({
            "id": str(reporte["_id"]),
            "usuario_id": reporte.get("usuario_id", ""),
            "nombre": reporte.get("nombre", ""),
            "correo": reporte.get("correo", ""),
            "modulo": reporte.get("modulo", ""),
            "descripcion": reporte.get("descripcion", ""),
            "fecha": reporte.get("fecha", "")
        })

    return datos


@app.get("/notificaciones/{usuario_id}")
def obtener_notificaciones(usuario_id: str):
    datos = []

    for n in notificaciones.find({"usuario_id": usuario_id}).sort("_id", -1):
        datos.append({
            "id": str(n["_id"]),
            "mensaje": n.get("mensaje", ""),
            "fecha": n.get("fecha", ""),
            "leida": n.get("leida", False)
        })

    return datos


@app.put("/notificaciones/{notificacion_id}/leer")
def marcar_notificacion_leida(notificacion_id: str):
    notificaciones.update_one(
        {"_id": ObjectId(notificacion_id)},
        {"$set": {"leida": True}}
    )

    return {
        "success": True,
        "mensaje": "Notificación marcada como leída"
    }


@app.get("/estadisticas")
def estadisticas():
    total_libros = libros.count_documents({})
    total_usuarios = usuarios.count_documents({})
    total_prestamos = prestamos.count_documents({})
    prestamos_activos = prestamos.count_documents({"estado": "Activo"})

    total_existencias = 0

    for libro in libros.find():
        total_existencias += libro.get("existencias", 0)

    return {
        "libros": total_libros,
        "usuarios": total_usuarios,
        "prestamos": total_prestamos,
        "prestamos_activos": prestamos_activos,
        "disponibles": total_existencias
    }


@app.get("/test-mongo")
def test_mongo():
    total = libros.count_documents({})

    return {
        "conexion": "ok",
        "libros": total
    }