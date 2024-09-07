import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResultService } from '../../service/result.service';
import { ResultDTO } from '../../dto/result.dto';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-event-results',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './event-results.component.html',
  styleUrl: './event-results.component.css'
})
export class EventResultsComponent {

  groupedResults: { [key: string]: ResultDTO[] } = {};
  eventItems: string[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private resultService: ResultService
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadResults(eventId);
    } else {
      this.error = 'Event ID not provided';
      this.loading = false;
    }
  }

  loadResults(eventId: string) {
    this.resultService.getResultsByEventId(eventId).subscribe({
      next: (response) => {
        this.loading = false;
        if (response.success) {
          this.groupResults(response.data);
          console.log(response)
          this.eventItems = Object.keys(this.groupedResults);
        } else {
          this.error = response.message || 'Failed to load results';
        }
      },
      error: (error) => {
        this.loading = false;
        this.error = 'An error occurred while loading results';
        console.error('Error loading results:', error);
      }
    });
  }

  groupResults(results: ResultDTO[]) {
    this.groupedResults = results.reduce((acc, result) => {
      const key = result.eventItemName || 'Unknown Event Item';
      if (!acc[key]) {
        acc[key] = [];
      }
      acc[key].push(result);
      return acc;
    }, {} as { [key: string]: ResultDTO[] });
  }

  getEventItems(): string[] {
    return this.eventItems;
  }

  getResultsForEventItem(eventItem: string): ResultDTO[] {
    return this.groupedResults[eventItem] || [];
  }
}
