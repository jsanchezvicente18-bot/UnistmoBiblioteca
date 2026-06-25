from pydantic import BaseModel

class CategoriaBuscada(BaseModel):
    categoria: str
    