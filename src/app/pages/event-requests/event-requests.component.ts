import { Component } from '@angular/core';
import { EventService } from '../../service/event.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-requests',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-requests.component.html',
  styleUrl: './event-requests.component.css'
})
export class EventRequestsComponent {
  pendingRegistrations: any[] = [];
  errorMessage: string = '';

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadPendingRegistrations();
  }

  loadPendingRegistrations(): void {
    this.eventService.getPendingRegistrations().subscribe({
      next: (response) => {
        if (response.success) {
          this.pendingRegistrations = response.data;
          console.log('Loaded pending registrations:', this.pendingRegistrations);
        } else {
          this.errorMessage = response.message || 'Failed to load pending registrations';
          console.error(this.errorMessage);
        }
      },
      error: (error) => {
        this.errorMessage = error.message || 'Error fetching pending registrations';
        console.error(this.errorMessage);
      }
    });
  }

  updateRegistrationStatus(registrationId: string, status: 'APPROVED' | 'REJECTED'): void {
    console.log(`Attempting to update registration ${registrationId} to ${status}`);
    this.eventService.updateRegistrationStatus(registrationId, status).subscribe({
      next: (response) => {
        if (response.success) {
          console.log(`Registration ${status} successfully:`, response.data);
          this.loadPendingRegistrations(); // Reload the list after update
        } else {
          this.errorMessage = response.message || `Failed to ${status.toLowerCase()} registration`;
          console.error(this.errorMessage);
        }
      },
      error: (error) => {
        this.errorMessage = error.message || `Error ${status.toLowerCase()}ing registration`;
        console.error(this.errorMessage);
      }
    });
  }
}
