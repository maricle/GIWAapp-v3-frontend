// import { Injectable } from '@angular/core';
// import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { environment } from 'src/environments/environment';
// import { Customer } from '../models/customer';

// @Injectable({
//   providedIn: 'root'
// })

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ServiceCommon } from './common/service-common';
import { Customer } from '../models/customer';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CustomerService extends ServiceCommon<Customer> {
  constructor(http: HttpClient) {
    super(http, environment.apiUrl + 'customers/');  // Cambia la URL base
  }
}


// export class CustomerService {

//   private apiUrl: string = environment.apiUrl + 'customers/';

//   constructor(private http: HttpClient) { }


//    getAll(): Observable<Customer[]> {

//     const headers = new HttpHeaders({
//       'Authorization': 'Basic ' + btoa('admin:admin')  // Reemplaza con tus credenciales
//     });

//     return this.http.get<Customer[]>(this.apiUrl);
//   }

//   async getAllContacts(): Promise<Customer[]> {
//     try {
//       const contacts = await lastValueFrom(this.getAll());
//       console.log(contacts);
//       return contacts
//     } catch (error) {
//       console.error('Error fetching customers', error);
//     }
//     return [] as Customer[];
//   }

//   getOne(id: number): Observable<Customer[]> {
//     const headers = new HttpHeaders({
//       'Authorization': 'Basic ' + btoa('admin:admin')  // Reemplaza con tus credenciales
//     });
//     return this.http.get<Customer[]>(this.apiUrl + id, { headers });
//   }

//   async save(customer: Customer) {
//     console.log("entra save", customer);


//     try {
//       await firstValueFrom(this.http.post<Customer>(this.apiUrl, customer));
//       console.log('saved');
//     } catch (e) {
//       console.log(e);
//     }

//   }

//   // saveMany(data: any[]) {
//   //   return this.http.post<Plan[]>(this.apiUrl + '/save/many', data);
//   // }


//   delete(id: number) {
//     console.log('entraservice')
//     return this.http.delete(this.apiUrl + id);
//   }

//   async update(id: number, customer: Customer) {


//     console.log("entra edit", customer);


//     const data = {
//       "id": customer.id,
//       "razon_social": customer.razon_social,
//       "last_name": customer.last_name,
//       "name": customer.name,
//       "email": customer.email,
//       "phone": customer.phone,
//       "cellphone": customer.cellphone,
//       "doc_number": customer.doc_number,
//       "designer": customer.designer,
//       "enable": customer.enable,
//       "supplier": false,
//       "tax_condition": customer.tax_condition,
//       "doc_type": customer.doc_type
//     };


//     try {

//       await firstValueFrom(this.http.put<Customer>(this.apiUrl + id + `/`, data));
//       console.log('saved');
//     } catch (e) {
//       console.log(e);
//     }

//   }



// }
