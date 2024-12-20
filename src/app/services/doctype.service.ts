import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom, Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; 

@Injectable({
  providedIn: 'root'
})
export class DoctypeService {
 
  
 private apiUrl:string = environment.apiUrl+'doctype/';

 constructor(private http: HttpClient) { }


 getAll(): Observable<any[]> {

   const headers = new HttpHeaders({
     'Authorization': 'Basic ' + btoa('admin:admin')  // Reemplaza con tus credenciales
   });

   return this.http.get<any[]>(this.apiUrl   );
 }

 getOne(id: number): Observable<any[]> {
   const headers = new HttpHeaders({
     'Authorization': 'Basic ' + btoa('admin:admin')  // Reemplaza con tus credenciales
   });
   return this.http.get<any[]>(this.apiUrl+id, {headers} );
 }

 async save(customer: any) { 


   try {
     await firstValueFrom(this.http.post<any>(this.apiUrl  , customer));
   } catch (e) {
     console.log(e);
   }

 }

 // saveMany(data: any[]) {
 //   return this.http.post<Plan[]>(this.apiUrl + '/save/many', data);
 // }


 delete(id: number) {
   console.log('entraservice')
   return this.http.delete(this.apiUrl+id);
 }

 update(customer: any) {
    
   return this.http.patch<any>(this.apiUrl , customer);
 }
}
