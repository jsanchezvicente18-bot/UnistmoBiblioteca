import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class Libros {

  private apiUrl = 'http://127.0.0.1:8000/libros';

  constructor(private http: HttpClient) {}

  obtenerLibros() {
    return this.http.get<any[]>(this.apiUrl);
  }

}