import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CoachDTO } from '../../dto/coach.dto';
import { CoachService } from '../../service/coach.service';

@Component({
  selector: 'app-coaches',
  standalone: true,
  imports: [RouterModule],
  templateUrl: './coaches.component.html',
  styleUrl: './coaches.component.css'
})
export class CoachesComponent {
  coaches: CoachDTO[] = [];

  constructor(private coachService: CoachService) {}

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
}
