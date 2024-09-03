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

  results: ResultDTO[] = [];
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
          this.results = response.data;
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
}
