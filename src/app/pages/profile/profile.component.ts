import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AthleteService } from '../../service/athlete.service';
import { ProfileDTO } from '../../dto/profile.dto';
import { CoachService } from '../../service/coach.service';
import { AuthService } from '../../service/auth.service';
import { AthleteDTO } from '../../dto/athlete.dto';
import { CoachDTO } from '../../dto/coach.dto';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [FormsModule,NgFor],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  profileData: ProfileDTO | null = null;
  isEditing = false;
  isOwnProfile = false;
  isAthleteViewing = false;
  achievementsText = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private athleteService: AthleteService,
    private coachService: CoachService,
    private authService: AuthService
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

  trackByIndex(index: number, item: any): number {
    return index;
  }
  loadProfileByType(id: string) {
    console.log(id);
    if (id.startsWith('at')) {
      this.loadProfileDetails(id);
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
          console.log(this.achievementsText);
          console.log(this.profileData);
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

  isAthlete(profile: ProfileDTO): profile is AthleteDTO {
    return 'height' in profile && 'weight' in profile;
  }

  isCoach(profile: ProfileDTO): profile is CoachDTO {
    return 'achievements' in profile && 'acceptingRequests' in profile;
  }

  startEdit() {
    this.isEditing = true;
  }

  cancelEdit() {
    this.isEditing = false;
    if (this.profileData) {
      this.loadProfileDetails(this.profileData.id);
    }
  }

  saveProfile() {
    if (this.profileData) {
      if (this.isAthlete(this.profileData)) {
        this.athleteService.updateAthlete(this.profileData.id, this.profileData).subscribe({
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
      } else if (this.isCoach(this.profileData)) {
        const updatedCoach = {
          ...this.profileData,
          achievements: this.achievementsText.split('\n').filter(a => a.trim() !== '')
        };
        this.coachService.updateCoach(this.profileData.id, updatedCoach).subscribe({
          next: (response) => {
            if (response.success) {
              this.profileData = response.data;
              this.isEditing = false;
            } else {
              console.error('Failed to update coach profile:', response.message);
            }
          },
          error: (error) => console.error('Error updating coach profile:', error)
        });
      }
    }
  }

  toggleAcceptingRequests() {
    if (this.profileData && this.isCoach(this.profileData)) {
      const newStatus:boolean = !this.profileData.acceptingRequests;
      console.log(newStatus);
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
      // this.athleteService.requestAssistance(this.profileData.id).subscribe({
      //   next: (response) => {
      //     if (response.success) {
      //       console.log('Assistance request sent successfully');
      //     } else {
      //       console.error('Failed to send assistance request:', response.message);
      //     }
      //   },
      //   error: (error) => console.error('Error sending assistance request:', error)
      // });
    }
  }

}
