from fastapi import APIRouter
from database import libros_collection

router = APIRouter()

@router.get("/libros")
def obtener_libros():

    libros = []

    for libro in libros_collection.find():
        libros.append({
            "id": str(libro["_id"]),
            "titulo": libro.get("titulo", ""),
            "autor": libro.get("autor", "")
        })

    return libros