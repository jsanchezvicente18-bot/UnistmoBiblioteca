from pydantic import BaseModel

class ReporteError(BaseModel):
    usuario_id: str = ""
    nombre: str = ""
    correo: str = ""
    modulo: str
    descripcion: str