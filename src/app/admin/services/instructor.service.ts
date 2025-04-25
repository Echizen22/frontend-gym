import { inject, Injectable } from '@angular/core';
import { ApiService } from '../../services/api.service';
import { Instructor } from '../interfaces/instructor.interface';

@Injectable({
  providedIn: 'root'
})
export class InstructorService {

  private readonly apiService = inject(ApiService);


  createInstructor(body: Instructor) {
      return this.apiService.doPost<Instructor>('/instructor', body, { responseType: 'json'});
  }

  getAllWithPagination() {
    return this.apiService.doGet<Instructor[]>('/instructor', { responseType: 'json'} );
  }

  getInstructorById(id: string) {
    return this.apiService.doGetWithId<Instructor>('/instructor', id, { responseType: 'json' });
  }


  updateInstructorById(id: string, body: Instructor ) {
    return this.apiService.doPatch<Instructor>('/instructor', id, body, { responseType: 'json'} );
  }

  deleteInstructor(id: string) {
    return this.apiService.doDelete<void>(['instructor', id], { responseType: 'json' });
  }

}
