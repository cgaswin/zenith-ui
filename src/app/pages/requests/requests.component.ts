import { Component } from '@angular/core';
import { CoachingRequestResponseDTO, CoachingRequestResponseSchema } from '../../dto/coachingRequestResponse.dto';
import { CoachService } from '../../service/coach.service';
import { ActivatedRoute } from '@angular/router';
import { ResponseDTO } from '../../dto/response.dto';
import { DatePipe, NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-requests',
  standalone: true,
  imports: [NgIf,NgFor,DatePipe],
  templateUrl: './requests.component.html',
  styleUrl: './requests.component.css'
})
export class RequestsComponent {
  requests: CoachingRequestResponseDTO[] | null = null;
  error: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private coachService: CoachService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadCoachingRequests(id);
      } else {
        this.error = 'Coach ID is missing.';
      }
    });
  }

  loadCoachingRequests(id: string): void {
    this.coachService.getCoachingRequestsByCoachId(id).subscribe({
      next: (response: ResponseDTO<CoachingRequestResponseDTO[]>) => {
        if (response.success) {
          // Validate data against the schema
          const result = response.data.every(request =>
            CoachingRequestResponseSchema.safeParse(request).success
          );

          if (result) {
            this.requests = response.data;
          } else {
            this.error = 'Invalid data format.';
          }
        } else {
          this.error = response.message;
        }
      },
      error: (err) => {
        this.error = 'Error fetching coaching requests.';
        console.error('Error fetching coaching requests:', err);
      }
    });
  }

  updateStatus(requestId: string, status: string): void {
    this.coachService.updateCoachingRequestStatus(requestId, status).subscribe({
      next: () => {
        // Refresh the request list or handle the success
        this.loadCoachingRequests(this.route.snapshot.paramMap.get('id')!);
      },
      error: (err) => {
        this.error = 'Error updating coaching request status.';
        console.error('Error updating coaching request status:', err);
      }
    });
  }
}
