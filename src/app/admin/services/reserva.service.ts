import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Reserva, ReservaPorHorario } from '../interfaces/reserva.interface';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {

  private readonly apiService = inject(ApiService);


  createReserva(body: Reserva) {
      return this.apiService.doPost<Reserva>('/reserva', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Reserva[]>('/reserva', { responseType: 'json'} );
  }

  getReservaById(id: string) {
    return this.apiService.doGetWithId<Reserva>('/reserva', id, { responseType: 'json' });
  }

  getReservaConfirmada(dni: string, idClase: string) {
    return this.apiService.doGetWithUrlWithParams<Reserva | null>(['reserva','usuario', dni, 'clase', idClase, 'reserva-confirmada' ], { responseType: 'json'});
  }


  updateReservaById(id: string, body: Reserva ) {
    return this.apiService.doPatch<Reserva>('/reserva', id, body, { responseType: 'json'} );
  }

  deleteReserva(id: string) {
    return this.apiService.doDelete<void>(['reserva', id], { responseType: 'json' });
  }

}
