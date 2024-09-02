import { Component } from '@angular/core';
import { EventService } from '../../service/event.service';
import { SlicePipe } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-results',
  standalone: true,
  imports: [SlicePipe,RouterModule],
  templateUrl: './results.component.html',
  styleUrl: './results.component.css'
})
export class ResultsComponent {
  events: any[] = [];

  constructor(private eventService: EventService) {}

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
}
