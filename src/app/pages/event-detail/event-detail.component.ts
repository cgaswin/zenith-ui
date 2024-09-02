import { Component, OnInit } from '@angular/core';
import { EventDTO, EventItemDTO } from '../../dto/event.dto';
import { EventService } from '../../service/event.service';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';
import { DatePipe } from '@angular/common';
import { string } from 'zod';


@Component({
  selector: 'app-event-detail',
  standalone: true,
  imports: [RouterModule,DatePipe],
  templateUrl: './event-detail.component.html',
  styleUrl: './event-detail.component.css'
})
export class EventDetailComponent implements OnInit{

  event: any = null;
  eventItems: any[] = [];
  athleteRegistrations: { [key: string]: string } = {};
  isAthlete: boolean = false;
  isAdmin: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(eventId);
      this.loadEventItems(eventId);
      this.isAthlete = this.authService.getUserRole() === 'ATHLETE';
      this.isAdmin = this.authService.getUserRole() === 'ADMIN';
      if (this.isAthlete) {
        this.loadAthleteRegistrations(eventId);
      }
    }
  }

  loadEventDetails(eventId: string): void {
    this.eventService.getEventById(eventId).subscribe({
      next: (response) => {
        if (response.success) {
          this.event = response.data;
        } else {
          console.error('Failed to load event details:', response.message);
        }
      },
      error: (error) => console.error('Error fetching event details:', error)
    });
  }

  loadEventItems(eventId: string): void {
    this.eventService.getEventItemsByEventId(eventId).subscribe({
      next: (response) => {
        if (response.success) {
          this.eventItems = response.data;
        } else {
          console.error('Failed to load event items:', response.message);
        }
      },
      error: (error) => console.error('Error fetching event items:', error)
    });
  }


  loadAthleteRegistrations(eventId: string): void {
    const athleteId = this.authService.getCurrentUserId();
    if (athleteId) {
      this.eventService.getEventRegistrationsForAthlete(eventId, athleteId).subscribe({
        next: (response) => {
          if (response.success) {
            this.athleteRegistrations = response.data.reduce((acc, reg) => {
              acc[reg.eventItemId] = reg.status;
              return acc;
            }, {} as { [key: string]: string });
          } else {
            console.error('Failed to load athlete registrations:', response.message);
          }
        },
        error: (error) => console.error('Error fetching athlete registrations:', error)
      });
    }
  }

  registerForEvent(eventItemId: string): void {
    if (this.event && this.isAthlete) {
      const athleteId = this.authService.getCurrentUserId();
      if (!athleteId) {
        console.error('Athlete ID is not available');
        return;
      }

      if (this.athleteRegistrations[eventItemId]) {
        console.log('Already registered for this event item');
        return;
      }

      const registrationData = {
        eventId: this.event.id,
        eventItemId: eventItemId,
        athleteId: athleteId
      };

      this.eventService.registerForEvent(registrationData).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Successfully registered for the event');
            this.athleteRegistrations[eventItemId] = 'PENDING';
          } else {
            console.error('Failed to register for the event:', response.message);
          }
        },
        error: (error) => console.error('Error registering for the event:', error)
      });
    }
  }

  getRegistrationStatus(eventItemId: string): string {
    return this.athleteRegistrations[eventItemId] || 'NOT_REGISTERED';
  }

}
