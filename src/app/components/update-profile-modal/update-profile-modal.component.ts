import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AthleteDTO } from '../../dto/athlete.dto';
import { CoachDTO } from '../../dto/coach.dto';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-update-profile-modal',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './update-profile-modal.component.html',
  styleUrl: './update-profile-modal.component.css'
})
export class UpdateProfileModalComponent {
  @Input() profile!: AthleteDTO | CoachDTO;
  @Output() update = new EventEmitter<AthleteDTO | CoachDTO>();
  @Output() cancel = new EventEmitter<void>();

  achievementsText: string = '';

  ngOnInit() {
    if (this.isCoach(this.profile)) {
      this.achievementsText = this.profile.achievements.join('\n');
    }
  }

  isAthlete(profile: AthleteDTO | CoachDTO): profile is AthleteDTO {
    return 'height' in profile && 'weight' in profile;
  }

  isCoach(profile: AthleteDTO | CoachDTO): profile is CoachDTO {
    return 'achievements' in profile;
  }

  onSubmit() {
    console.log('Achievements before split:', this.achievementsText);
    if (this.isCoach(this.profile)) {
      this.profile.achievements = this.achievementsText.split('\n').filter(a => a.trim() !== '');
      console.log('Achievements after split:', this.profile.achievements);
    }
    this.update.emit(this.profile);
  }

  onCancel() {
    this.cancel.emit();
  }
}
