import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ClaseDetalleCompleto } from '../interfaces/clases-con-horario.interface';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {

  private readonly apiService: ApiService = inject(ApiService);

  getClasesConHorarios(): Observable<ClaseDetalleCompleto[]> {
    return this.apiService.doGet<ClaseDetalleCompleto[]>('/clase/clases-con-horarios', { responseType: 'json'} );
  }

  getClaseConHorarios(id: string): Observable<ClaseDetalleCompleto> {
    return this.apiService.doGetWithId<ClaseDetalleCompleto>('/clase/clase-con-horarios', id, { responseType: 'json'} );
  }

}
