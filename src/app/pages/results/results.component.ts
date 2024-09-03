import { Component } from '@angular/core';
import { EventService } from '../../service/event.service';
import { SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [SlicePipe,RouterModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  events: any[] = [];

  constructor(
    private eventService: EventService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.loadEvents();
  }

  loadEvents() {
    this.eventService.getAllEvents().subscribe(response => {
      if (response.success) {
        this.events = response.data;
      }
    });
  }

  getResultsRoute(eventId: string): string[] {
    const baseRoute = this.authService.isLoggedIn() ? ['/dashboard', 'results', eventId] : ['/results', eventId];
    return baseRoute;
  }
}
