import { Component } from '@angular/core';
import { EventDTO, EventItemDTO } from '../../dto/event.dto';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../service/event.service';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/auth.service';

interface EventItemData {
  name: string;
  description: string;
}

@Component({
  selector: 'app-event-item-creation',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './event-item-creation.component.html',
  styleUrl: './event-item-creation.component.css'
})
export class EventItemCreationComponent {
  event: any = null;
  eventItems: any[] = [];
  newItem: EventItemData = {
    name: '',
    description: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private eventsService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventDetails(eventId);
      this.loadEventItems(eventId);
    }
  }

  loadEventDetails(eventId: string): void {
    this.eventsService.getEventById(eventId).subscribe({
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
    this.eventsService.getEventItems(eventId).subscribe({
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

  onSubmit(): void {
    if (this.event) {
      const currentUserId = this.authService.getCurrentUserId();
      if (!currentUserId) {
        console.error('User ID is not available');
        return;
      }

      const itemData = {
        ...this.newItem,
        eventId: this.event.id,
        createdBy: currentUserId
      };

      this.eventsService.createEventItem(itemData).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Event item created successfully');
            this.eventItems.push(response.data);
            this.newItem = { name: '', description: '' };
          } else {
            console.error('Failed to create event item:', response.message);
          }
        },
        error: (error) => console.error('Error creating event item:', error)
      });
    }
  }
}
