import { Injectable } from '@angular/core';
import { ResponseDTO } from '../dto/response.dto';
import { EventDTO, EventItemDTO, EventRegistrationDTO } from '../dto/event.dto';
import { catchError, forkJoin, map, Observable, throwError,switchMap, of } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { z } from 'zod';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private apiUrl = 'http://localhost:8091/event-service/api/v1';

  constructor(private http: HttpClient) {}

  getAllEvents(): Observable<ResponseDTO<EventDTO[]>> {
    return this.http.get<ResponseDTO<EventDTO[]>>(`${this.apiUrl}/event`).pipe(
      map(response => ({
        ...response,
        data: z.array(EventDTO).parse(response.data)
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
    return this.http.get<ResponseDTO<EventItemDTO[]>>(`${this.apiUrl}/eventItem/event/${eventId}`).pipe(
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
    console.log(url,registrationId,status)
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


  getEventById(id: string): Observable<ResponseDTO<EventDTO>> {
    return this.http.get<ResponseDTO<EventDTO>>(`${this.apiUrl}/event/${id}`).pipe(
      map(response => ({
        ...response,
        data: EventDTO.parse(response.data)
      })),
      catchError(error => {
        console.error(`Error fetching event with id ${id}:`, error);
        return throwError(() => new Error(`Failed to fetch event with id ${id}`));
      })
    );
  }

  getRegistrationsByAthleteId(athleteId: string): Observable<ResponseDTO<EventRegistrationDTO[]>> {
    return this.http.get<ResponseDTO<EventRegistrationDTO[]>>(`${this.apiUrl}/registration/athlete/${athleteId}`);
  }

  getRegisteredEventsForAthlete(athleteId: string): Observable<ResponseDTO<EventDTO[]>> {
    return this.getRegistrationsByAthleteId(athleteId).pipe(
      switchMap(registrationsResponse => {
        if (registrationsResponse.success && Array.isArray(registrationsResponse.data) && registrationsResponse.data.length > 0) {
          // Extract unique event IDs from registrations
          const eventIds = [...new Set(registrationsResponse.data.map(reg => reg.eventId))];
          // Fetch full event details for each unique event ID
          return forkJoin(eventIds.map(id => this.getEventById(id))).pipe(
            map(events => ({
              message: "Registered events retrieved successfully",
              success: true,
              data: events.filter(e => e.success).map(e => e.data)
            }))
          );
        } else {
          // If no registrations found, return an observable of the empty response
          return of({
            message: "No registered events found",
            success: false,
            data: []
          });
        }
      }),
      catchError(error => {
        console.error('Error fetching registered events:', error);
        return of({
          message: "An error occurred while fetching registered events",
          success: false,
          data: []
        });
      })
    );
  }

  getEventStats(): Observable<ResponseDTO<any>> {
    return this.http.get<ResponseDTO<any>>(`${this.apiUrl}/event/stats`);
  }

  private handleError(error: HttpErrorResponse) {
    console.error('An error occurred:', error);
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // Return an observable with a user-facing error message
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }



}
