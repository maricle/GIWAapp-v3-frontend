import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Status } from '../models/status';

@Injectable({
  providedIn: 'root'
})
export class StatusService {


  private apiUrl: string = environment.apiUrl + 'orderstatus/';

  constructor(private http: HttpClient) { }


  getAll(): Observable<any[]> {

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')  // Reemplaza con tus credenciales
    });

    return this.http.get<any[]>(this.apiUrl);
  }
  async getAllvalues(): Promise<Status[]> {
    try {
      const orders = await lastValueFrom(this.getAll());

      return orders
    } catch (error) {
      console.error('Error fetching orders', error);
    }
    return [] as Status[];
  }

  getOne(id: number): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')  // Reemplaza con tus credenciales
    });
    return this.http.get<any[]>(this.apiUrl + id, { headers });
  }

  async save(customer: any) {


    try {
      await firstValueFrom(this.http.post<any>(this.apiUrl, status));
    } catch (e) {
      console.log(e);
    }

  }

  // saveMany(data: any[]) {
  //   return this.http.post<Plan[]>(this.apiUrl + '/save/many', data);
  // }


  delete(id: number) {
    console.log('entraservice')
    return this.http.delete(this.apiUrl + id);
  }

  update(customer: any) {

    return this.http.patch<any>(this.apiUrl, customer);
  }
}
