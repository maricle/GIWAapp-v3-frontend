import { Injectable } from '@angular/core';
import { ServiceCommon } from './common/service-common';
import { Invoice } from '../models/invoice';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Estimate } from '../models/estimate';

@Injectable({
  providedIn: 'root'
})
export class EstimateService extends ServiceCommon<Estimate>{

  constructor(http: HttpClient) {
    super(http, environment.apiUrl + 'estimate/');  // Pasa la URL base específica para "customers"
  }


}
