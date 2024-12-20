import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { Invoice } from '../models/invoice';
import { environment } from 'src/environments/environment';
import { ServiceCommon } from './common/service-common';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService extends ServiceCommon<Invoice> {


  constructor(http: HttpClient) {
    super(http, environment.apiUrl + 'invoice/');  // Pasa la URL base específica para "customers"
  }




}

