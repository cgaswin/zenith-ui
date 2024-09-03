import { Component } from '@angular/core';
import { EventService } from '../../service/event.service';
import { AuthService } from '../../service/auth.service';
import { EventDTO } from '../../dto/event.dto';
import { DatePipe, SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [SlicePipe,DatePipe,RouterModule],
  templateUrl: './my-events.component.html',
  styleUrl: './my-events.component.css'
})
export class MyEventsComponent {
  registeredEvents: EventDTO[] = [];
  loading = true;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadRegisteredEvents();
  }

  loadRegisteredEvents() {
    const athleteId = this.authService.getCurrentUserId();
    if (athleteId) {
      this.eventService.getRegisteredEventsForAthlete(athleteId).subscribe({
        next: (response) => {
          this.loading = false;
          if (response.success) {
            this.registeredEvents = response.data;
            // Sort events by date in descending order
            this.registeredEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
          } else {
            this.error = response.message || 'Failed to load registered events';
          }
        },
        error: (error) => {
          this.loading = false;
          this.error = 'An error occurred while loading your events. Please try again later.';
          console.error('Error loading registered events:', error);
        }
      });
    } else {
      this.loading = false;
      this.error = 'Unable to retrieve athlete information. Please try logging in again.';
    }
  }
}
