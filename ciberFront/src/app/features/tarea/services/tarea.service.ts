import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TareaService {
  private http = inject(HttpClient);

  private readonly baseUrl = `${environment.apiUrl}/tareas`;

  constructor() {}

  listarUsuarios(): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl);
  }

  listarTareas(page: number, size: number): Observable<any> {
    const params = new HttpParams().set('page', page).set('size', size);
    return this.http.get<any>(`${this.baseUrl}`, { params });
  }

  crearTarea(tarea: any): Observable<any> {
    return this.http.post<any>(this.baseUrl, tarea);
  }

  eliminarTarea(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }
  filtrarTareas(
    filtros: any,
    page: number = 0,
    size: number = 5,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());

    if (filtros.estado) {
      params = params.set('estado', filtros.estado);
    }
    if (filtros.prioridad) {
      params = params.set('prioridad', filtros.prioridad);
    }
    if (filtros.fechaLimite) {
      params = params.set('fechaLimite', filtros.fechaLimite);
    }
    if (filtros.activo) {
      params = params.set('activo', filtros.activo);
    }
    return this.http.get(`${this.baseUrl}/filtrar`, { params });
  }

  obtenerTareasPorMes(
    anio: number,
    mes: number,
    page: number = 0,
    size: number = 5,
  ): Observable<any> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString());
    if (anio) {
      params = params.set('anio', anio);
    }
    if (mes) {
      params = params.set('mes', mes);
    }
    return this.http.get(`${this.baseUrl}/mes`, { params });
  }

  obtenerTareaId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/${id}`);
  }

  actualizarEstadoTarea(id: number, estado: string): Observable<any> {
    const params = new HttpParams().set('estado', estado);
    return this.http.put<any>(`${this.baseUrl}/${id}/estado`, {}, { params });
  }
}
