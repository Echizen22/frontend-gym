import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Usuario } from '../interfaces/usuario.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly apiService = inject(ApiService);

  getAllWithPagination() {
    return this.apiService.doGet<Usuario[]>('/usuario', { responseType: 'json'} );
  }

}
