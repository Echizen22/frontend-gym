import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Promocion } from '../interfaces/promocion.interface';
import { OptionsDropDown } from '../interfaces/form-field.interface';

@Injectable({
  providedIn: 'root'
})
export class PromocionService {

  private readonly apiService = inject(ApiService);

  createPromocion(body: Promocion) {
      return this.apiService.doPost<Promocion>('/promocion', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Promocion[]>('/promocion', { responseType: 'json'} );
  }

  getPromocionById(id: string) {
    return this.apiService.doGetWithId<Promocion>('/promocion', id, { responseType: 'json' });
  }


  updatePromocionById(id: string, body: Promocion ) {
    return this.apiService.doPatch<Promocion>('/promocion', id, body, { responseType: 'json'} );
  }

  deletePromocion(id: string) {
    return this.apiService.doDelete<void>(['promocion', id], { responseType: 'json' });
  }

  // Dropdown
  getPromocionesForDropdown() {
    return this.apiService.doGet<OptionsDropDown[]>('/promocion/dropdown', { responseType: 'json'} );
  }

}
