import { Injectable } from '@angular/core';
import { ResponseDTO } from '../dto/response.dto';
import { EventDTO, EventItemDTO, EventRegistrationDTO } from '../dto/event.dto';
import { catchError, map, Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { z } from 'zod';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:8081/api/v1';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<ResponseDTO<EventDTO[]>> {
    return this.http.get<ResponseDTO<EventDTO[]>>(`${this.apiUrl}/event`).pipe(
      map(response => ({
        ...response,
        data: z.array(EventDTO).parse(response.data)
      }))
    );
  }

  getEventById(id: string): Observable<ResponseDTO<EventDTO>> {
    return this.http.get<ResponseDTO<EventDTO>>(`${this.apiUrl}/event/${id}`).pipe(
      map(response => ({
        ...response,
        data: EventDTO.parse(response.data)
      }))
    );
  }

  createEvent(formData: FormData): Observable<ResponseDTO<EventDTO>> {
    return this.http.post<ResponseDTO<EventDTO>>(`${this.apiUrl}/event`, formData).pipe(
      map(response => ({
        ...response,
        data: EventDTO.parse(response.data)
      }))
    );
  }

  getEventItems(eventId: string): Observable<ResponseDTO<EventItemDTO[]>> {
    return this.http.get<ResponseDTO<EventItemDTO[]>>(`${this.apiUrl}/eventItem?eventId=${eventId}`).pipe(
      map(response => ({
        ...response,
        data: z.array(EventItemDTO).parse(response.data)
      }))
    );
  }

  createEventItem(eventItemData: Omit<EventItemDTO, 'id' | 'createdAt' | 'updatedAt'>): Observable<ResponseDTO<EventItemDTO>> {
    return this.http.post<ResponseDTO<EventItemDTO>>(`${this.apiUrl}/eventItem`, eventItemData).pipe(
      map(response => ({
        ...response,
        data: EventItemDTO.parse(response.data)
      }))
    );
  }

  registerForEvent(registrationData: Omit<EventRegistrationDTO, 'id' | 'status' | 'registrationDate'>): Observable<ResponseDTO<EventRegistrationDTO>> {
    return this.http.post<ResponseDTO<EventRegistrationDTO>>(`${this.apiUrl}/registration`, registrationData).pipe(
      map(response => ({
        ...response,
        data: EventRegistrationDTO.parse(response.data)
      }))
    );
  }

  getAllEventRegistrations(): Observable<ResponseDTO<EventRegistrationDTO[]>> {
    return this.http.get<ResponseDTO<EventRegistrationDTO[]>>(`${this.apiUrl}/registration`).pipe(
      map(response => ({
        ...response,
        data: z.array(EventRegistrationDTO).parse(response.data)
      }))
    );
  }


  getEventRegistrationsForAthlete(eventId: string, athleteId: string): Observable<ResponseDTO<EventRegistrationDTO[]>> {
    return this.http.get<ResponseDTO<EventRegistrationDTO[]>>(`${this.apiUrl}/registration/event/${eventId}/athlete/${athleteId}`).pipe(
      map(response => ({
        ...response,
        data: z.array(EventRegistrationDTO).parse(response.data)
      }))
    );
  }

  getEventItemsByEventId(eventId: string): Observable<ResponseDTO<EventItemDTO[]>> {
    return this.http.get<ResponseDTO<EventItemDTO[]>>(`${this.apiUrl}/eventItem/event/${eventId}`).pipe(
      map(response => ({
        ...response,
        data: z.array(EventItemDTO).parse(response.data)
      }))
    );
  }



  private getHeaders(): HttpHeaders {
    const token = localStorage.getItem('token');
    return new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    });
  }

  getPendingRegistrations(): Observable<ResponseDTO<EventRegistrationDTO[]>> {
    return this.http.get<ResponseDTO<EventRegistrationDTO[]>>(`${this.apiUrl}/registration/pending`, { headers: this.getHeaders() }).pipe(
      map(response => ({
        ...response,
        data: z.array(EventRegistrationDTO).parse(response.data)
      })),
      catchError(this.handleError)
    );
  }

  updateRegistrationStatus(registrationId: string, status: 'APPROVED' | 'REJECTED'): Observable<ResponseDTO<EventRegistrationDTO>> {
    const url = `${this.apiUrl}/registration/${registrationId}/status?status=${status}`;
    return this.http.patch<ResponseDTO<EventRegistrationDTO>>(url, {}, { headers: this.getHeaders() }).pipe(
      map(response => ({
        ...response,
        data: EventRegistrationDTO.parse(response.data)
      })),
      catchError(this.handleError)
    );
  }

  getApprovedRegistrations(eventItemId: string): Observable<ResponseDTO<EventRegistrationDTO[]>> {
    return this.http.get<ResponseDTO<EventRegistrationDTO[]>>(`${this.apiUrl}/registration/approved/event-item/${eventItemId}`).pipe(
      map(response => ({
        ...response,
        data: z.array(EventRegistrationDTO).parse(response.data)
      }))
    );
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }



}
