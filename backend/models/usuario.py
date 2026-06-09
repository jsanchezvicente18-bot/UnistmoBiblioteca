from pydantic import BaseModel

class Usuario(BaseModel):
    nombre: str
    matricula: str
    correo: str
    telefono: str
    password: str
    tipo: str
    carrera: str = ""