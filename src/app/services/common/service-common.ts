// service-common.ts
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export abstract class ServiceCommon<T> {
  protected baseUrl: string;

  constructor(protected http: HttpClient, baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  getAll(): Observable<T[]> {
    return this.http.get<T[]>(`${this.baseUrl}`);
  }

  getById(id: number): Observable<T> {
    return this.http.get<T>(`${this.baseUrl}/${id}`);
  }

  create(item: T): Observable<T> {
    return this.http.post<T>(`${this.baseUrl}`, item);
  }

  update(id: number, item: T): Observable<T> {
    return this.http.put<T>(`${this.baseUrl}/${id}`, item);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
