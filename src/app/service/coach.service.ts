import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ResponseDTO } from '../dto/response.dto';
import { CoachDTO } from '../dto/coach.dto';
import { CoachingRequestResponseDTO } from '../dto/coachingRequestResponse.dto';
import { CoachingRequestRequestDTO } from '../dto/coachRequest.dto';



@Injectable({
  providedIn: 'root'
})
export class CoachService {
  private apiUrl = 'http://localhost:8091/user-service/api/v1/coach';
  private requestUrl = 'http://localhost:8091/user-service/api/v1/request';

  constructor(private http: HttpClient) {}

  getAllCoaches(): Observable<ResponseDTO<CoachDTO[]>> {
    return this.http.get<ResponseDTO<CoachDTO[]>>(this.apiUrl);
  }

  getCoachById(id: string): Observable<ResponseDTO<CoachDTO>> {
    return this.http.get<ResponseDTO<CoachDTO>>(`${this.apiUrl}/${id}`);
  }

  updateCoach(id: string, coachData: Partial<CoachDTO>): Observable<ResponseDTO<CoachDTO>> {
    console.log(coachData);
    return this.http.put<ResponseDTO<CoachDTO>>(`${this.apiUrl}/${id}`, coachData);
  }

  updateAcceptingRequests(id: string, isAccepting: boolean): Observable<ResponseDTO<CoachDTO>> {
    return this.http.put<ResponseDTO<CoachDTO>>(`${this.apiUrl}/${id}/accepting-requests?acceptingRequests=${isAccepting}`, {});
  }

  getCoachingRequestsByCoachId(id: string): Observable<ResponseDTO<CoachingRequestResponseDTO[]>> {
    return this.http.get<ResponseDTO<CoachingRequestResponseDTO[]>>(`${this.requestUrl}/coach/${id}`);
  }

  updateCoachingRequestStatus(id: string, status: string): Observable<ResponseDTO<void>> {
    return this.http.put<ResponseDTO<void>>(`${this.requestUrl}/${id}/status`, {}, {
      params: { status: status }
    });
  }

  getCoachStats(): Observable<ResponseDTO<any>> {
    return this.http.get<ResponseDTO<any>>(`${this.apiUrl}/stats`);
  }

  createCoachingRequest(requestData: CoachingRequestRequestDTO): Observable<ResponseDTO<CoachingRequestResponseDTO>> {
    return this.http.post<ResponseDTO<CoachingRequestResponseDTO>>(`${this.requestUrl}`, requestData);
  }
}
