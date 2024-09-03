import { Component, NgModule } from '@angular/core';
import { AthleteDTO } from '../../dto/athlete.dto';
import { Router, RouterModule } from '@angular/router';
import { AthleteService } from '../../service/athlete.service';
import { AuthService } from '../../service/auth.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-athletes',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './athletes.component.html',
  styleUrl: './athletes.component.css'
})
export class AthletesComponent {
  athletes: AthleteDTO[] = [];
  filteredAthletes: AthleteDTO[] = [];
  searchQuery: string = '';

  constructor(
    private athleteService: AthleteService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadAthletes();
  }

  loadAthletes() {
    this.athleteService.getAllAthletes().subscribe({
      next: (response) => {
        if (response.success) {
          this.athletes = response.data;
          this.filteredAthletes = this.athletes; // Initialize filteredAthletes with all athletes
        } else {
          console.error('Failed to load athletes:', response.message);
        }
      },
      error: (error) => console.error('Error fetching athletes:', error)
    });
  }

  onSearchChange() {
    this.filteredAthletes = this.athletes.filter(athlete =>
      athlete.name.toLowerCase().includes(this.searchQuery.toLowerCase())
    );
  }

  onAthleteClick(athleteId: string) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/profile', athleteId]);
    } else {
      this.router.navigate(['/profile', athleteId]);
    }
  }
}
