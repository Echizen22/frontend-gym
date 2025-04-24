import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../interfaces/usuario.interface';
import { PaginatedResponse } from '../interfaces/pagainted-response.interface';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly apiService = inject(ApiService);


  createUser(body: Usuario) {
    return this.apiService.doPost<Usuario>('/usuario', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Usuario[]>('/usuario', { responseType: 'json'} );
  }

  getUserFilter() {
    return this.apiService.doGet<Usuario[]>('/usuario/filter', { responseType: 'json'} );
  }


  getUserById(dni: string) {
    return this.apiService.doGetWithId<Usuario>('/usuario', dni, { responseType: 'json' });
  }


  updateUserById(dni: string, body: Usuario ) {
    return this.apiService.doPatch<Usuario>('/usuario', dni, body, { responseType: 'json'} );
  }

}
