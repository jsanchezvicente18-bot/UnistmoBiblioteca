from pydantic import BaseModel

class Prestamo(BaseModel):
    usuario_id: str
    libro_id: str