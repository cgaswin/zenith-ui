import { Component } from '@angular/core';
import { AthleteDTO } from '../../dto/athlete.dto';
import { Router, RouterModule } from '@angular/router';
import { AthleteService } from '../../service/athlete.service';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-athletes',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './athletes.component.html',
  styleUrl: './athletes.component.css'
})
export class AthletesComponent {
  athletes: AthleteDTO[] = [];

  constructor(private athleteService: AthleteService) {}

  ngOnInit() {
    this.loadAthletes();
  }

  loadAthletes() {
    this.athleteService.getAllAthletes().subscribe({
      next: (response) => {
        if (response.success) {
          this.athletes = response.data;
        } else {
          console.error('Failed to load athletes:', response.message);
        }
      },
      error: (error) => console.error('Error fetching athletes:', error)
    });
  }
}
