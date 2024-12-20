import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { Product } from '../models/product';
import { environment } from 'src/environments/environment';
import { ServiceCommon } from './common/service-common';

@Injectable({
  providedIn: 'root'
})
export class ProductService extends ServiceCommon<Product> {


  constructor(http: HttpClient) {
    super(http, environment.apiUrl + 'product/');  // Pasa la URL base específica para "customers"
  }




}

