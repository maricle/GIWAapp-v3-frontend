import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ServiceCommon } from './common/service-common';
import { Contact } from '../models/contact';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactService extends ServiceCommon<Contact> {

  constructor(http: HttpClient) {
    super(http, environment.apiUrl + 'contacts/');  // Cambia la URL base
  }

  getDetails(id: number): Observable<any[]> {
    return this.http.get<any[]>(`${environment.apiUrl}contactsDetails/${id}/`);
  }
}