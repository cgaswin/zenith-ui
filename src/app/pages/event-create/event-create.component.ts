import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { EventService } from '../../service/event.service';
import { Router } from '@angular/router';
import { AuthService } from '../../service/auth.service';

interface EventData {
  name: string;
  description: string;
  venue: string;
  date: string;
}

@Component({
  selector: 'app-event-create',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './event-create.component.html',
  styleUrl: './event-create.component.css'
})
export class EventCreateComponent {

  eventData: EventData = {
    name: '',
    description: '',
    venue: '',
    date: ''
  };
  imageFile: File | null = null;

  constructor(
    private eventsService: EventService,
    private router: Router,
    private authService: AuthService
  ) {}

  onFileSelected(event: any): void {
    if (event.target.files.length > 0) {
      this.imageFile = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (!this.imageFile) {
      console.error('No image file selected');
      return;
    }

    const formData = new FormData();
    const currentUserId = this.authService.getCurrentUserId();

    if (!currentUserId) {
      console.error('User ID is not available');
      return;
    }

    formData.append('event.name', this.eventData.name);
    formData.append('event.description', this.eventData.description);
    formData.append('event.venue', this.eventData.venue);
    formData.append('event.date', this.eventData.date);
    formData.append('event.createdBy', currentUserId);
    formData.append('image', this.imageFile);

    console.log(formData);

    this.eventsService.createEvent(formData).subscribe({
      next: (response) => {
        if (response.success) {
          console.log('Event created successfully');
          this.router.navigate(['/dashboard/events']);
        } else {
          console.error('Failed to create event:', response.message);
        }
      },
      error: (error) => console.error('Error creating event:', error)
    });
  }


}
