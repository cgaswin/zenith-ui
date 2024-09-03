import { ChangeDetectorRef, Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
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

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,NgFor,DatePipe,UpdateProfileModalComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileData: ProfileDTO | null = null;
  isEditing = false;
  isOwnProfile = false;
  isAthleteViewing = false;
  performances: ResultDTO[] = [];
  topPerformance: ResultDTO | null = null;
  achievementsText: string = ''; // Add this line

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private athleteService: AthleteService,
    private coachService: CoachService,
    private authService: AuthService,
    private resultService: ResultService,
    private cdr: ChangeDetectorRef
  ) {}


  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');

      if (id) {
        this.loadProfileByType(id);
        this.isOwnProfile = this.authService.getCurrentUserId() === id;
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
      // Convert achievementsText to array before updating

      updatedProfile.achievements = this.achievementsText.split('\n').filter(a => a.trim() !== '');

      this.coachService.updateCoach(updatedProfile.id, updatedProfile).subscribe({
        next: (response) => {
          if (response.success) {
            this.profileData = response.data;
            this.isEditing = false;
            // Update achievementsText after successful update
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

  startEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
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
      // Implement the request assistance functionality here
      console.log('Requesting assistance from coach:', this.profileData.id);
    }
  }
}
