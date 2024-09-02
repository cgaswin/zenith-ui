import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ResponseDTO } from '../dto/response.dto';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private apiUrl = 'http://localhost:8081/api/v1/result';

  constructor(private http: HttpClient) {}

  createResult(resultData: any): Observable<ResponseDTO<any>> {
    return this.http.post<ResponseDTO<any>>(`${this.apiUrl}`, resultData);
  }

  getAllResults(): Observable<ResponseDTO<any[]>> {
    return this.http.get<ResponseDTO<any[]>>(`${this.apiUrl}`);
  }

  getResultById(id: string): Observable<ResponseDTO<any>> {
    return this.http.get<ResponseDTO<any>>(`${this.apiUrl}/${id}`);
  }

  getResultsByEventId(eventId: string): Observable<ResponseDTO<any[]>> {
    return this.http.get<ResponseDTO<any[]>>(`${this.apiUrl}/event/${eventId}`);
  }

  getResultsByEventItemId(eventItemId: string): Observable<ResponseDTO<any[]>> {
    return this.http.get<ResponseDTO<any[]>>(`${this.apiUrl}/event-item/${eventItemId}`);
  }

  createBulkResults(results: any[]): Observable<ResponseDTO<any>> {
    return this.http.post<ResponseDTO<any>>(`${this.apiUrl}/bulk`, results);
  }
}
