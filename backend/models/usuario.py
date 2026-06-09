from pydantic import BaseModel
from typing import Literal

class Usuario(BaseModel):
    nombre: str
    correo: str
    tipo: Literal["admin", "profesor", "estudiante"]