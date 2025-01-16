import { Injectable } from '@angular/core';
import { ContactList } from '../models/contactList';
import { ServiceCommon } from './common/service-common';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ContactListService extends ServiceCommon<ContactList> {

  constructor(http: HttpClient) { 
    super(http, environment.apiUrl + 'contactsList/');
  }
}
