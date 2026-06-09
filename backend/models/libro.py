from pydantic import BaseModel

class Libro(BaseModel):
    titulo: str
    autor: str
    categoria: str
    isbn: str
    existencias: int