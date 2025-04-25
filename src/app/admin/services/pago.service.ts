import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Pago } from '../interfaces/pago.interface';

@Injectable({
  providedIn: 'root'
})
export class PagoService {

  private readonly apiService = inject(ApiService);


  createPago(body: Pago) {
      return this.apiService.doPost<Pago>('/pago', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Pago[]>('/pago', { responseType: 'json'} );
  }

  getPagoById(id: string) {
    return this.apiService.doGetWithId<Pago>('/pago', id, { responseType: 'json' });
  }


  updatePagoById(id: string, body: Pago ) {
    return this.apiService.doPatch<Pago>('/pago', id, body, { responseType: 'json'} );
  }

  deletePago(id: string) {
    return this.apiService.doDelete<void>(['pago', id], { responseType: 'json' });
  }

}
