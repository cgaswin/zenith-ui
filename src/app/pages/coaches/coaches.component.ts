import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CoachDTO } from '../../dto/coach.dto';
import { CoachService } from '../../service/coach.service';
import { AuthService } from '../../service/auth.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoachingStatusDTO } from '../../dto/coachingStatus.dto';
import { AthleteService } from '../../service/athlete.service';
import { CoachingRequestResponseDTO, CoachingRequestResponseSchema } from '../../dto/coachingRequestResponse.dto';
import { z } from 'zod';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [RouterModule,NgClass,FormsModule],
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.css'
})
export class CoachesComponent {
  coaches: CoachDTO[] = [];
  filteredCoaches: CoachDTO[] = [];
  searchQuery: string = '';
  coachingRequests: CoachingRequestResponseDTO[] = [];
  pendingRequests: Set<string> = new Set();
  assignedCoachId: string | null = null;

  constructor(
    private coachService: CoachService,
    private authService: AuthService,
    private athleteService: AthleteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCoaches();
    if (this.isAthlete()) {
      this.loadCoachingRequests();
    }
  }

  loadCoaches() {
    this.coachService.getAllCoaches().subscribe({
      next: (response) => {
        if (response.success) {
          this.coaches = response.data;
          this.filteredCoaches = this.coaches;
        } else {
          console.error('Failed to load coaches:', response.message);
        }
      },
      error: (error) => console.error('Error fetching coaches:', error)
    });
  }

  loadCoachingRequests() {
    const athleteId = this.authService.getCurrentUserId();
    if (athleteId) {
      this.athleteService.getCoachingStatus(athleteId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            try {
              if (Array.isArray(response.data)) {
                this.coachingRequests = z.array(CoachingRequestResponseSchema).parse(response.data);
              } else {
                const singleRequest = CoachingRequestResponseSchema.parse(response.data);
                this.coachingRequests = [singleRequest];
              }
              this.updatePendingRequests();
              this.checkAssignedCoach();
            } catch (error) {
              console.error('Error parsing coaching request data:', error);
              this.coachingRequests = [];
            }
          } else {
            this.coachingRequests = [];
          }
        },
        error: (error) => {
          console.error('Error fetching coaching requests:', error);
          this.coachingRequests = [];
        }
      });
    }
  }

  updatePendingRequests() {
    this.pendingRequests.clear();
    this.coachingRequests.forEach(request => {
      if (request.status === 'PENDING') {
        this.pendingRequests.add(request.coach.id);
      }
    });
  }

  checkAssignedCoach() {
    const assignedRequest = this.coachingRequests.find(request => request.status === 'APPROVED');
    this.assignedCoachId = assignedRequest ? assignedRequest.coach.id : null;
  }

  onSearchChange() {
    const query = this.searchQuery.toLowerCase();
    this.filteredCoaches = this.coaches.filter(coach =>
      coach.name.toLowerCase().includes(query)
    );
  }

  onCoachClick(coachId: string) {
    this.router.navigate(['/dashboard/profile', coachId]);
  }

  isAthlete(): boolean {
    return this.authService.getUserRole() === 'ATHLETE';
  }

  canRequestCoach(coach: CoachDTO): boolean {
    return coach.acceptingRequests && !this.assignedCoachId && !this.pendingRequests.has(coach.id);
  }

  isRequestPending(coachId: string): boolean {
    return this.pendingRequests.has(coachId);
  }

  requestCoach(coachId: string) {
    const athleteId = this.authService.getCurrentUserId();
    if (athleteId) {
      this.coachService.createCoachingRequest({ athleteId, coachId }).subscribe({
        next: (response) => {
          if (response.success) {
            this.pendingRequests.add(coachId);
            // Refresh coaching requests after successful request
            this.loadCoachingRequests();
          } else {
            console.error('Failed to send coaching request:', response.message);
          }
        },
        error: (error) => console.error('Error sending coaching request:', error)
      });
    }
  }
}
