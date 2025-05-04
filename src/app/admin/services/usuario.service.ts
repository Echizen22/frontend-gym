import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Usuario, UsuarioMembresia } from '../interfaces/usuario.interface';
import { PaginatedResponse } from '../interfaces/pagainted-response.interface';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OptionsDropDown } from '../interfaces/form-field.interface';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private readonly apiService = inject(ApiService);


  createUser(body: Usuario) {
    return this.apiService.doPost<Usuario>('/usuario', body, { responseType: 'json'});
  }

  createUsuarioMembresia(body: UsuarioMembresia) {
    return this.apiService.doPost<UsuarioMembresia>('/usuario-membresia', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Usuario[]>('/usuario', { responseType: 'json'} );
  }

  getUserById(dni: string) {
    return this.apiService.doGetWithId<Usuario>('/usuario', dni, { responseType: 'json' });
  }

  checkUserExist(dni: string) {
    return this.apiService.doGetWithId<{ exists: boolean }>('/usuario/check-dni', dni, { responseType: 'json' });
  }

  checkEamilExist(email: string) {
    return this.apiService.doGet<{ exists: boolean }>(`/usuario/check-email?email=${email}`, { responseType: 'json'});
  }


  getUseMembresiarById(id: string) {
    return this.apiService.doGetWithId<UsuarioMembresia>('/usuario-membresia', id, { responseType: 'json' });
  }


  updateUserById(dni: string, body: Usuario ) {
    return this.apiService.doPatch<Usuario>('/usuario', dni, body, { responseType: 'json'} );
  }

  updateUserForProfileById(dni: string, body: Partial<Usuario>) {
    return this.apiService.doPatch<Usuario>('/usuario', dni, body, { responseType: 'json'} );
  }

  updateUsuarioMembresiaById(id: string, body: UsuarioMembresia ) {
    return this.apiService.doPatch<UsuarioMembresia>('/usuario-membresia', id, body, { responseType: 'json'} );
  }

  deleteUser(dni: string) {
    return this.apiService.doDelete<void>(['usuario', dni], { responseType: 'json' });
  }

  deleteUserMembresia(id: string) {
    return this.apiService.doDelete<void>(['usuario-membresia', id], { responseType: 'json' });
  }

  // Dropdown
  getUsuariosForDropdown() {
    return this.apiService.doGet<OptionsDropDown[]>('/usuario/dropdown', { responseType: 'json'} );
  }

  getUsuarioMembresiaForDropdown() {
    return this.apiService.doGet<OptionsDropDown[]>('/usuario-membresia/dropdown', { responseType: 'json'} );
  }


}
