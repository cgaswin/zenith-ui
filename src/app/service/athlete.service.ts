import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AthleteDTO } from '../dto/athlete.dto';
import {  Observable } from 'rxjs';
import { ResponseDTO } from '../dto/response.dto';
import { CoachingStatusDTO } from '../dto/coachingStatus.dto';
import { CoachingRequestResponseDTO } from '../dto/coachingRequestResponse.dto';

@Injectable({
  providedIn: 'root'
})
export class AthleteService {

  private apiUrl = 'http://localhost:8091/user-service/api/v1/athlete';

  constructor(private http: HttpClient) {}

  getAllAthletes(): Observable<ResponseDTO<AthleteDTO[]>> {
    return this.http.get<ResponseDTO<AthleteDTO[]>>(this.apiUrl);
  }

  getAthleteById(id: string): Observable<ResponseDTO<AthleteDTO>> {
    return this.http.get<ResponseDTO<AthleteDTO>>(`${this.apiUrl}/${id}`);
  }

  updateAthlete(id: string, athleteData: Partial<AthleteDTO>): Observable<ResponseDTO<AthleteDTO>> {
    return this.http.put<ResponseDTO<AthleteDTO>>(`${this.apiUrl}/${id}`, athleteData);
  }

  getAthleteStats(): Observable<ResponseDTO<any>> {
    return this.http.get<ResponseDTO<any>>(`${this.apiUrl}/stats`);
  }


  getCoachingStatus(athleteId: string): Observable<ResponseDTO<CoachingRequestResponseDTO | null>> {
    return this.http.get<ResponseDTO<CoachingRequestResponseDTO | null>>(`${this.apiUrl}/${athleteId}/coaching-status`);
  }
}
