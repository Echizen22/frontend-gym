import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Membresia, MembresiaPromocion } from '../interfaces/membresia.interface';
import { OptionsDropDown } from '../interfaces/form-field.interface';

@Injectable({
  providedIn: 'root'
})
export class MembresiaService {

  private readonly apiService = inject(ApiService);


  createMembresia(body: Membresia) {
      return this.apiService.doPost<Membresia>('/membresia', body, { responseType: 'json'});
  }

  createMembresiaPromocion(body: MembresiaPromocion) {
    return this.apiService.doPost<MembresiaPromocion>('/membresia-promocion', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Membresia[]>('/membresia', { responseType: 'json'} );
  }

  getMembresiaById(id: string) {
    return this.apiService.doGetWithId<Membresia>('/membresia', id, { responseType: 'json' });
  }

  getMembresiaPromocionById(id: string) {
    return this.apiService.doGetWithId<MembresiaPromocion>('/membresia-promocion', id, { responseType: 'json' });
  }

  updateMembresiaById(id: string, body: Membresia ) {
    return this.apiService.doPatch<Membresia>('/membresia', id, body, { responseType: 'json'} );
  }

  updateMembresiaPromocionById(id: string, body: MembresiaPromocion ) {
    return this.apiService.doPatch<MembresiaPromocion>('/membresia-promocion', id, body, { responseType: 'json'} );
  }

  deleteMembresia(id: string) {
    return this.apiService.doDelete<void>(['membresia', id], { responseType: 'json' });
  }

  deleteMembresiaPromocion(id: string) {
    return this.apiService.doDelete<void>(['membresia-promocion', id], { responseType: 'json' });
  }

  // Dropdown
  getMembresiasForDropdown() {
    return this.apiService.doGet<OptionsDropDown[]>('/membresia/dropdown', { responseType: 'json'} );
  }



}
