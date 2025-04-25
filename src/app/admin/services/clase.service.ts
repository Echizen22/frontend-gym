import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Clase } from '../interfaces/clase.interface';

@Injectable({
  providedIn: 'root'
})
export class ClaseService {

  private readonly apiService = inject(ApiService);


  createClase(body: Clase) {
      return this.apiService.doPost<Clase>('/clase', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Clase[]>('/clase', { responseType: 'json'} );
  }

  getClaseById(id: string) {
    return this.apiService.doGetWithId<Clase>('/clase', id, { responseType: 'json' });
  }


  updateClaseById(id: string, body: Clase ) {
    return this.apiService.doPatch<Clase>('/clase', id, body, { responseType: 'json'} );
  }

  deleteClase(id: string) {
    return this.apiService.doDelete<void>(['clase', id], { responseType: 'json' });
  }

}
