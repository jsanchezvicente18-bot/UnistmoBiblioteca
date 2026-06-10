from pydantic import BaseModel

class Login(BaseModel):
    matricula: str
    password: str