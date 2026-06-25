from pydantic import BaseModel

class MensajeAdmin(BaseModel):
    nombre: str
    correo: str
    asunto: str
    mensaje: str