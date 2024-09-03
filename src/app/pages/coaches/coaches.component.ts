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
          }
        },
        error: (error) => console.error('Error fetching coaching status:', error)
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
           (this.coachingStatus.status !== 'APPROVED' && this.coachingStatus.status !== 'PENDING'));
  }

  requestCoach(coachId: string) {
    const athleteId = this.authService.getCurrentUserId();
    if (athleteId) {
      this.coachService.createCoachingRequest({ athleteId, coachId }).subscribe({
        next: (response) => {
          if (response.success) {
            console.log('Coaching request sent successfully');
            this.loadCoachingStatus();
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
