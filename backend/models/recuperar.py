from pydantic import BaseModel

class SolicitarRecuperacion(BaseModel):
    correo: str

class CambiarPassword(BaseModel):
    correo: str
    nueva_password: str