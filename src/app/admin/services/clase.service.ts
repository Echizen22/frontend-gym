import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Clase, Horario } from '../interfaces/clase.interface';
import { OptionsDropDown } from '../interfaces/form-field.interface';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {

  private readonly apiService = inject(ApiService);


  createClase(body: Clase) {
      return this.apiService.doPost<Clase>('/clase', body, { responseType: 'json'});
  }

  createHorario(body: Horario) {
    return this.apiService.doPost<Horario>('/horario', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Clase[]>('/clase', { responseType: 'json'} );
  }

  getClaseById(id: string) {
    return this.apiService.doGetWithId<Clase>('/clase', id, { responseType: 'json' });
  }

  getHorarioById(id: string) {
    return this.apiService.doGetWithId<Horario>('/horario', id, { responseType: 'json' });
  }


  updateClaseById(id: string, body: Clase ) {
    return this.apiService.doPatch<Clase>('/clase', id, body, { responseType: 'json'} );
  }

  updateHorarioById(id: string, body: Horario ) {
    return this.apiService.doPatch<Horario>('/horario', id, body, { responseType: 'json'} );
  }

  deleteClase(id: string) {
    return this.apiService.doDelete<void>(['clase', id], { responseType: 'json' });
  }

  deleteHorario(id: string) {
    return this.apiService.doDelete<void>(['horario', id], { responseType: 'json' });
  }

  // Dropdown
  getClasesForDropdown() {
    return this.apiService.doGet<OptionsDropDown[]>('/clase/dropdown', { responseType: 'json'} );
  }

}
