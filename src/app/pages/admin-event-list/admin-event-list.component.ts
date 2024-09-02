import { Component } from '@angular/core';
import { EventDTO } from '../../dto/event.dto';
import { EventService } from '../../service/event.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-admin-event-list',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './admin-event-list.component.html',
  styleUrl: './admin-event-list.component.css'
})
export class AdminEventListComponent {
  events: EventDTO[] = [];

  constructor(private eventsService: EventService) {}

  ngOnInit(): void {
    this.loadEvents();
  }

  loadEvents(): void {
    this.eventsService.getAllEvents().subscribe({
      next: (response) => {
        if (response.success) {
          this.events = response.data;
        } else {
          console.error('Failed to load events:', response.message);
        }
      },
      error: (error) => console.error('Error fetching events:', error)
    });
  }
}
