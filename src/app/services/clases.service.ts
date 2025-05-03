import { inject, Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable } from 'rxjs';
import { ClaseConHorario } from '../interfaces/clases-con-horario.interface';

@Injectable({
  providedIn: 'root'
})
export class ClasesService {

  private readonly apiService: ApiService = inject(ApiService);

  getClasesConHorarios(): Observable<ClaseConHorario[]> {
    return this.apiService.doGet<ClaseConHorario[]>('/clase/con-horarios', { responseType: 'json'} );
  }

}
