import { Component } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { CoachDTO } from '../../dto/coach.dto';
import { CoachService } from '../../service/coach.service';
import { AuthService } from '../../service/auth.service';
import { NgClass } from '@angular/common';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [RouterModule,NgClass],
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.css'
})
export class CoachesComponent {
  coaches: CoachDTO[] = [];

  constructor(private coachService: CoachService,private authService:AuthService,private router:Router) {}

  ngOnInit() {
    this.loadCoaches();
  }

  loadCoaches() {
    this.coachService.getAllCoaches().subscribe({
      next: (response) => {
        if (response.success) {
          this.coaches = response.data;
          console.log(response.data)
        } else {
          console.error('Failed to load coaches:', response.message);
        }
      },
      error: (error) => console.error('Error fetching coaches:', error)
    });
  }

  onCoachClick(coachId: string) {
    if (this.authService.isLoggedIn()) {
      this.router.navigate(['/dashboard/profile', coachId]);
    } else {
      this.router.navigate(['/profile', coachId]);
    }
  }
  
}
