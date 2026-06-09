from pydantic import BaseModel

class Usuario(BaseModel):
    nombre: str
    matricula: str
    carrera: str = ""
    correo: str
    telefono: str
    password: str
    tipo: str