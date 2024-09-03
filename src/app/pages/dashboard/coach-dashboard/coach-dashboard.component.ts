import { Component } from '@angular/core';
import { StatsComponent } from '../../stats/stats.component';

@Component({
  selector: 'app-coach-dashboard',
  standalone: true,
  imports: [StatsComponent],
  templateUrl: './coach-dashboard.component.html',
  styleUrl: './coach-dashboard.component.css'
})
export class CoachDashboardComponent {

}
