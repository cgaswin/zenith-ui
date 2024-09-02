import { Component } from '@angular/core';
import { FormArray, FormBuilder, FormGroup,ReactiveFormsModule,Validators } from '@angular/forms';
import { EventService } from '../../service/event.service';
import { ResultService } from '../../service/result.service';

@Component({
  selector: 'app-publish-results',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './publish-results.component.html',
  styleUrl: './publish-results.component.css'
})
export class PublishResultsComponent {
  events: any[] = [];
  selectedEvent: any = null;
  eventItems: any[] = [];
  selectedEventItem: any = null;
  resultsForm: FormGroup;

  constructor(
    private eventService: EventService,
    private resultService: ResultService,
    private formBuilder: FormBuilder
  ) {
    this.resultsForm = this.formBuilder.group({
      results: this.formBuilder.array([])
    });
  }

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

  onEventSelect(eventId: string) {
    this.selectedEvent = this.events.find(e => e.id === eventId);
    if (this.selectedEvent) {
      this.loadEventItems(eventId);
    }
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
    if (this.selectedEventItem) {
      this.loadParticipants(eventItemId);
    }
  }

  loadParticipants(eventItemId: string) {
    this.eventService.getApprovedRegistrations(eventItemId).subscribe(response => {
      if (response.success) {
        this.initializeResultsForm(response.data);
        console.log(response.data)
      }
    });
  }

  initializeResultsForm(participants: any[]) {
    const resultsFormArray = this.formBuilder.array(
      participants.map(participant => this.formBuilder.group({
        athleteId: [participant.athleteId],
        athleteName: [participant.athleteName],
        score: ['', [Validators.required, Validators.min(0)]]
      }))
    );
    this.resultsForm.setControl('results', resultsFormArray);
  }

  get resultsFormArray() {
    return this.resultsForm.get('results') as FormArray;
  }

  onSubmit() {
    if (this.resultsForm.valid && this.selectedEvent && this.selectedEventItem) {
      const results = this.resultsFormArray.value.map((result: any) => ({
        eventId: this.selectedEvent.id,
        eventItemId: this.selectedEventItem.id,
        athleteId: result.athleteId,
        score: result.score
      }));

      this.resultService.createBulkResults(results).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Results published successfully');
            this.resultsForm.reset();
            // Optionally, provide feedback or refresh the form
          } else {
            console.error('Failed to publish results:', response.message);
          }
        },
        error: (error) => console.error('Error publishing results:', error)
      });
    }
  }
}
