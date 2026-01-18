import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProyectoService {
  private http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/proyectos`;

  constructor() {}

  crearProyecto(proyecto: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, proyecto);
  }

  listarProyectos(page: number = 0, size: number = 5): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    return this.http.get<any>(`${this.baseUrl}/filtrar`, { params });
  }

  eliminarProyecto(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
}
