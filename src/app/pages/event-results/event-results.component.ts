import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EventService } from '../../service/event.service';
import { ResultService } from '../../service/result.service';

@Component({
  selector: 'app-event-results',
  standalone: true,
  imports: [],
  templateUrl: './event-results.component.html',
  styleUrl: './event-results.component.css'
})
export class EventResultsComponent {

  event: any;
  eventItems: any[] = [];
  selectedEventItem: any;
  results: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private resultService: ResultService
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEvent(eventId);
      this.loadEventItems(eventId);
    }
  }

  loadEvent(eventId: string) {
    this.eventService.getEventById(eventId).subscribe(response => {
      if (response.success) {
        this.event = response.data;
      }
    });
  }

  loadEventItems(eventId: string) {
    this.eventService.getEventItems(eventId).subscribe(response => {
      if (response.success) {
        this.eventItems = response.data;
      }
    });
  }

  onEventItemSelect(eventItemId: string) {
    this.selectedEventItem = this.eventItems.find(ei => ei.id === eventItemId);
    this.loadResults(eventItemId);
  }

  loadResults(eventItemId: string) {
    this.resultService.getResultsByEventItemId(eventItemId).subscribe(response => {
      if (response.success) {
        this.results = response.data;
      }
    });
  }
}
