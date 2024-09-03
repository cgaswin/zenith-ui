import { Component } from '@angular/core';
import { CoachingRequestResponseDTO, CoachingRequestResponseSchema } from '../../dto/coachingRequestResponse.dto';
import { CoachService } from '../../service/coach.service';
import { ActivatedRoute } from '@angular/router';
import { ResponseDTO } from '../../dto/response.dto';
import { DatePipe, NgFor, NgIf } from '@angular/common';
import { AuthService } from '../../service/auth.service';

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
    private coachService: CoachService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.loadCoachingRequests();
  }

  loadCoachingRequests(): void {
    const coachId = this.authService.getCurrentUserId();
    if (coachId) {
      this.coachService.getCoachingRequestsByCoachId(coachId).subscribe({
        next: (response) => {
          if (response.success) {
            this.requests = response.data;
            console.log(response.data)
          } else {
            this.error = response.message || 'Failed to load coaching requests';
          }
        },
        error: (err) => {
          console.error('Error fetching coaching requests:', err);
          this.error = 'Error fetching coaching requests. Please try again later.';
        }
      });
    } else {
      this.error = 'Unable to determine coach ID.';
    }
  }

  updateStatus(requestId: string, status: string): void {
    this.coachService.updateCoachingRequestStatus(requestId, status).subscribe({
      next: (response) => {
        if (response.success) {
          this.loadCoachingRequests(); // Reload the requests after updating
        } else {
          this.error = 'Failed to update request status';
        }
      },
      error: (err) => {
        console.error('Error updating coaching request status:', err);
        this.error = 'Error updating request status. Please try again later.';
      }
    });
  }
}
