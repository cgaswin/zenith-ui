import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AthleteService } from '../../service/athlete.service';
import { ProfileDTO } from '../../dto/profile.dto';
import { CoachService } from '../../service/coach.service';
import { AuthService } from '../../service/auth.service';
import { AthleteDTO } from '../../dto/athlete.dto';
import { CoachDTO } from '../../dto/coach.dto';
import { DatePipe, NgFor } from '@angular/common';
import { ResultService } from '../../service/result.service';
import { ResultDTO } from '../../dto/result.dto';
import { UpdateProfileModalComponent } from '../../components/update-profile-modal/update-profile-modal.component';
import { CoachingRequestResponseDTO, CoachingRequestResponseSchema } from '../../dto/coachingRequestResponse.dto';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,NgFor,DatePipe,UpdateProfileModalComponent,RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileData: ProfileDTO | null = null;
  coachingStatus: CoachingRequestResponseDTO | null = null;
  isEditing = false;
  isOwnProfile = false;
  isAthleteViewing = false;
  performances: ResultDTO[] = [];
  topPerformance: ResultDTO | null = null;
  achievementsText: string = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private athleteService: AthleteService,
    private coachService: CoachService,
    private authService: AuthService,
    private resultService: ResultService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProfileByType(id);
        this.isOwnProfile = this.authService.getCurrentUserId() === id;
        this.isAthleteViewing = this.authService.getUserRole() === 'ATHLETE';
      } else {
        const currentUserId = this.authService.getCurrentUserId();
        if (currentUserId) {
          this.loadProfileByType(currentUserId);
          this.isOwnProfile = true;
        } else {
          this.router.navigate(['/']);
        }
      }
    });
  }

  loadProfileByType(id: string) {
    if (id.startsWith('at')) {
      this.loadProfileDetails(id);
      this.loadAthletePerformances(id);
      this.loadTopPerformance(id);
      this.loadCoachingStatus(id);
    } else if (id.startsWith('ch')) {
      this.loadCoachProfile(id);
    } else {
      console.error('Invalid ID format');
      this.router.navigate(['/']);
    }
  }

  loadProfileDetails(id: string) {
    this.athleteService.getAthleteById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.profileData = response.data;
        } else {
          console.error('Failed to load athlete profile:', response.message);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error fetching athlete profile details:', error);
        this.router.navigate(['/']);
      }
    });
  }

  loadCoachProfile(id: string) {
    this.coachService.getCoachById(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.profileData = response.data;
          if (this.isCoach(this.profileData)) {
            this.achievementsText = this.profileData.achievements.join('\n');
          }
        } else {
          console.error('Failed to load coach profile:', response.message);
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.error('Error fetching coach profile details:', error);
        this.router.navigate(['/']);
      }
    });
  }

  loadCoachingStatus(athleteId: string) {
    this.athleteService.getCoachingStatus(athleteId).subscribe({
      next: (response) => {
        if (response.success && response.data) {
          const validationResult = CoachingRequestResponseSchema.safeParse(response.data);
          if (validationResult.success) {
            this.coachingStatus = validationResult.data;
          } else {
            console.error('Invalid coaching status data:', validationResult.error);
            // You might want to set a default or empty coaching status here
            this.coachingStatus = null;
          }
        } else {
          console.log('No active coaching relationship or request');
          this.coachingStatus = null;
        }
      },
      error: (error) => {
        console.error('Error fetching coaching status:', error);
        this.coachingStatus = null;
      }
    });
  }

  loadAthletePerformances(id: string) {
    this.resultService.getResultsByAthleteId(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.performances = response.data;
        } else {
          console.error('Failed to load athlete performances:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching athlete performances:', error);
      }
    });
  }

  loadTopPerformance(id: string) {
    this.resultService.getTopPerformanceByAthleteId(id).subscribe({
      next: (response) => {
        if (response.success) {
          this.topPerformance = response.data;
        } else {
          console.error('Failed to load top performance:', response.message);
        }
      },
      error: (error) => {
        console.error('Error fetching top performance:', error);
      }
    });
  }

  isAthlete(profile: ProfileDTO | null): profile is AthleteDTO {
    return profile !== null && 'height' in profile && 'weight' in profile;
  }

  isCoach(profile: ProfileDTO | null): profile is CoachDTO {
    return profile !== null && 'achievements' in profile && 'acceptingRequests' in profile;
  }

  get hasCoach(): boolean {
    return this.coachingStatus?.status === 'APPROVED';
  }

  get hasPendingRequest(): boolean {
    return this.coachingStatus?.status === 'PENDING';
  }

  startEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
  }

  saveProfile(updatedProfile: AthleteDTO | CoachDTO) {
    if (this.isAthlete(updatedProfile)) {
      this.athleteService.updateAthlete(updatedProfile.id, updatedProfile).subscribe({
        next: (response) => {
          if (response.success) {
            this.profileData = response.data;
            this.isEditing = false;
          } else {
            console.error('Failed to update athlete profile:', response.message);
          }
        },
        error: (error) => console.error('Error updating athlete profile:', error)
      });
    } else if (this.isCoach(updatedProfile)) {
      updatedProfile.achievements = this.achievementsText.split('\n').filter(a => a.trim() !== '');
      this.coachService.updateCoach(updatedProfile.id, updatedProfile).subscribe({
        next: (response) => {
          if (response.success) {
            this.profileData = response.data;
            this.isEditing = false;
            if (this.isCoach(this.profileData)) {
              this.achievementsText = this.profileData.achievements.join('\n');
            }
          } else {
            console.error('Failed to update coach profile:', response.message);
          }
        },
        error: (error) => console.error('Error updating coach profile:', error)
      });
    }
  }

  toggleAcceptingRequests() {
    if (this.profileData && this.isCoach(this.profileData)) {
      const newStatus = !this.profileData.acceptingRequests;
      this.coachService.updateAcceptingRequests(this.profileData.id, newStatus).subscribe({
        next: (response) => {
          if (response.success) {
            this.profileData = response.data;
          } else {
            console.error('Failed to update accepting requests status:', response.message);
          }
        },
        error: (error) => console.error('Error updating accepting requests status:', error)
      });
    }
  }

  requestAssistance() {
    if (this.profileData && this.isCoach(this.profileData) && this.isAthleteViewing) {
      const athleteId = this.authService.getCurrentUserId();
      if (athleteId) {
        this.coachService.createCoachingRequest({ athleteId, coachId: this.profileData.id }).subscribe({
          next: (response) => {
            if (response.success) {
              console.log('Coaching request sent successfully');
              this.loadCoachingStatus(athleteId);
            } else {
              console.error('Failed to send coaching request:', response.message);
            }
          },
          error: (error) => console.error('Error sending coaching request:', error)
        });
      }
    }
  }

}
