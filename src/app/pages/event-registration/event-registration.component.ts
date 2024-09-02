import { Component } from '@angular/core';
import { EventService } from '../../service/event.service';

@Component({
  selector: 'app-event-registration',
  standalone: true,
  imports: [],
  templateUrl: './event-registration.component.html',
  styleUrl: './event-registration.component.css'
})
export class EventRegistrationComponent {
  registrations: any[] = [];

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.loadRegistrations();
  }

  loadRegistrations(): void {
    this.eventService.getAllEventRegistrations().subscribe({
      next: (response) => {
        if (response.success) {
          this.registrations = response.data;
        } else {
          console.error('Failed to load registrations:', response.message);
        }
      },
      error: (error) => console.error('Error fetching registrations:', error)
    });
  }

  updateRegistrationStatus(registrationId: string, status: 'APPROVED' | 'REJECTED'): void {
    this.eventService.updateRegistrationStatus(registrationId, status).subscribe({
      next: (response) => {
        if (response.success) {
          console.log(`Registration ${status} successfully`);
          this.loadRegistrations(); // Reload the registrations to reflect the change
        } else {
          console.error(`Failed to ${status.toLowerCase()} registration:`, response.message);
        }
      },
      error: (error) => console.error(`Error ${status.toLowerCase()}ing registration:`, error)
    });
  }
}
