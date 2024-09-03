import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CoachDTO } from '../../dto/coach.dto';
import { CoachService } from '../../service/coach.service';
import { AuthService } from '../../service/auth.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoachingStatusDTO } from '../../dto/coachingStatus.dto';
import { AthleteService } from '../../service/athlete.service';
import { CoachingRequestResponseDTO } from '../../dto/coachingRequestResponse.dto';

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
  coachingStatus: CoachingRequestResponseDTO | null = null;


  constructor(
    private coachService: CoachService,
    private authService: AuthService,
    private athleteService: AthleteService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCoaches();
    if (this.isAthlete()) {
      this.loadCoachingStatus();
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

  loadCoachingStatus() {
    const athleteId = this.authService.getCurrentUserId();
    if (athleteId) {
      this.athleteService.getCoachingStatus(athleteId).subscribe({
        next: (response) => {
          if (response.success && response.data) {
            this.coachingStatus = response.data;
          } else {
            this.coachingStatus = null;
          }
        },
        error: (error) => {
          console.error('Error fetching coaching status:', error);
          this.coachingStatus = null;
        }
      });
    }
  }

  onSearchChange() {
    const query = this.searchQuery.toLowerCase();
    this.filteredCoaches = this.coaches.filter(coach =>
      coach.name.toLowerCase().includes(query)
    );
  }

  onCoachClick(coachId: string) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/profile', coachId]);
    } else {
      this.router.navigate(['/profile', coachId]);
    }
  }

  canRequestCoach(coach: CoachDTO): boolean {
    return coach.acceptingRequests &&
           (!this.coachingStatus ||
           (this.coachingStatus.status !== 'APPROVED' &&
            this.coachingStatus.status !== 'PENDING') ||
           (this.coachingStatus.status === 'PENDING' && this.coachingStatus.coach?.id !== coach.id));
  }

  requestCoach(coachId: string) {
    const athleteId = this.authService.getCurrentUserId();
    const athleteName = this.authService.getUsername() || 'Unknown';

    if (athleteId) {
      this.coachService.createCoachingRequest({ athleteId, coachId }).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Coaching request sent successfully');
            const requestedCoach = this.coaches.find(c => c.id === coachId);

            // Update the local coachingStatus immediately
            this.coachingStatus = {
              id: response.data.id, // Assuming the response includes the new request ID
              status: 'PENDING',
              coach: {
                id: coachId,
                name: requestedCoach?.name || 'Unknown'
              },
              athlete: {
                id: athleteId,
                name: athleteName
              },
              requestDate: new Date().toISOString() // Optional, you can include this if needed
            };
          } else {
            console.error('Failed to send coaching request:', response.message);
          }
        },
        error: (error) => console.error('Error sending coaching request:', error)
      });
    }
  }

  isAthlete(): boolean {
    return this.authService.getUserRole() === 'ATHLETE';
  }
}
