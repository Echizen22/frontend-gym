import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Membresia } from '../interfaces/membresia.interface';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {

  private readonly apiService = inject(ApiService);


  createMembresia(body: Membresia) {
      return this.apiService.doPost<Membresia>('/membresia', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Membresia[]>('/membresia', { responseType: 'json'} );
  }

  getMembresiaById(id: string) {
    return this.apiService.doGetWithId<Membresia>('/membresia', id, { responseType: 'json' });
  }


  updateMembresiaById(id: string, body: Membresia ) {
    return this.apiService.doPatch<Membresia>('/membresia', id, body, { responseType: 'json'} );
  }

  deleteMembresia(id: string) {
    return this.apiService.doDelete<void>(['membresia', id], { responseType: 'json' });
  }


}
