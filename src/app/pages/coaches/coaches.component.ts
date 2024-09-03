import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CoachDTO } from '../../dto/coach.dto';
import { CoachService } from '../../service/coach.service';
import { AuthService } from '../../service/auth.service';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  constructor(
    private coachService: CoachService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCoaches();
  }

  loadCoaches() {
    this.coachService.getAllCoaches().subscribe({
      next: (response) => {
        if (response.success) {
          this.coaches = response.data;
          this.filteredCoaches = this.coaches; // Initialize filteredCoaches with all coaches
        } else {
          console.error('Failed to load coaches:', response.message);
        }
      },
      error: (error) => console.error('Error fetching coaches:', error)
    });
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
}
