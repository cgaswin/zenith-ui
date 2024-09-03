import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ResponseDTO } from '../dto/response.dto';
import { ResultDTO, ResultRequestDTO } from '../dto/result.dto';

@Injectable({
  providedIn: 'root'
})
export class ResultService {

  private apiUrl = 'http://localhost:8091/event-service/api/v1/result';

  constructor(private http: HttpClient) {}

  createBulkResults(results: ResultRequestDTO[]): Observable<ResponseDTO<ResultDTO[]>> {
    return this.http.post<ResponseDTO<ResultDTO[]>>(`${this.apiUrl}/bulk`, results).pipe(
      map(response => ({
        ...response,
        data: response.data.map(result => ResultDTO.parse(result))
      }))
    );
  }

  getResultsByEventId(eventId: string): Observable<ResponseDTO<ResultDTO[]>> {
    return this.http.get<ResponseDTO<ResultDTO[]>>(`${this.apiUrl}/event/${eventId}`).pipe(
      map(response => ({
        ...response,
        data: response.data.map(result => ResultDTO.parse(result))
      }))
    );
  }

  getResultsByEventItemId(eventItemId: string): Observable<ResponseDTO<ResultDTO[]>> {
    return this.http.get<ResponseDTO<ResultDTO[]>>(`${this.apiUrl}/event-item/${eventItemId}`).pipe(
      map(response => ({
        ...response,
        data: response.data.map(result => ResultDTO.parse(result))
      }))
    );
  }

  getResultsByAthleteId(athleteId: string): Observable<ResponseDTO<ResultDTO[]>> {
    return this.http.get<ResponseDTO<ResultDTO[]>>(`${this.apiUrl}/athlete/${athleteId}`).pipe(
      map(response => ({
        ...response,
        data: response.data.map(result => ResultDTO.parse(result))
      }))
    );
  }

  getTopPerformanceByAthleteId(athleteId: string): Observable<ResponseDTO<ResultDTO>> {
    return this.http.get<ResponseDTO<ResultDTO>>(`${this.apiUrl}/athlete/${athleteId}/top`).pipe(
      map(response => ({
        ...response,
        data: ResultDTO.parse(response.data)
      }))
    );
  }
}
