import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { EventDTO } from '../../dto/event.dto';
import { EventService } from '../../service/event.service';
import { DatePipe } from '@angular/common';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [RouterModule,DatePipe],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {
  events: EventDTO[] = [];
  isAdmin: boolean = false;
  isAthlete: boolean = false;
  isCoach: boolean = false;
  isLoggedIn:boolean=false;



  constructor(
    private eventsService: EventService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadEvents();
    this.isAdmin = this.authService.getUserRole() === 'ADMIN';
    this.isLoggedIn = this.authService.getUserRole() === 'ADMIN' || this.authService.getUserRole() === 'ATHLETE' || this.authService.getUserRole() === 'COACH';
  }

  loadEvents(): void {
    this.eventsService.getAllEvents().subscribe({
      next: (response) => {
        if (response.success) {
          this.events = response.data;
          console.log(response.data)
        } else {
          console.error('Failed to load events:', response.message);
        }
      },
      error: (error) => console.error('Error fetching events:', error)
    });
  }



}
