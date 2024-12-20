import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, lastValueFrom, Observable } from 'rxjs';
import { Order } from '../models/order';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl: string = environment.apiUrl + 'orders/';

  constructor(private http: HttpClient) { }
  getAll(): Observable<Order[]> {

    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')  // Reemplaza con tus credenciales
    });

    return this.http.get<Order[]>(this.apiUrl);
  }
  async getAllContacts(): Promise<Order[]> {
    try {
        const orders = await lastValueFrom(this.getAll());
         
        return orders
    } catch (error) {
        console.error('Error fetching orders', error);
    }
    return [] as Order[];
}

  getOne(id: number): Observable<Order[]> {
    const headers = new HttpHeaders({
      'Authorization': 'Basic ' + btoa('admin:admin')  // Reemplaza con tus credenciales
    });
    return this.http.get<Order[]>(this.apiUrl + id, { headers });
  }

  async save(order: Order) { 

    try {
      await firstValueFrom(this.http.post<Order>(this.apiUrl, order));
      console.log('saved');
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

  async update(id: number,order: Order) {


    console.log("entra edit", order);

    const data={     
        "id":order.id,
        "name": order.name,
        "date": order.date,
        "description": order.description,
        "priority": order.priority,
        "contact": order.contact,
        "status": order.status  
      
  };


    try { 
      
      await firstValueFrom(this.http.put<Order>(this.apiUrl+id+`/` , data));
      console.log('saved');
    } catch (e) {
      console.log(e);
    }

  }

}
