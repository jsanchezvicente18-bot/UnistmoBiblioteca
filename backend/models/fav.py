from pydantic import BaseModel

class Favorito(BaseModel):
    usuario_id: str
    libro_id: str
    