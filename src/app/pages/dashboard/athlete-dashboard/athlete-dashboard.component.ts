import { Component } from '@angular/core';
import { StatsComponent } from '../../stats/stats.component';

@Component({
  selector: 'app-athlete-dashboard',
  standalone: true,
  imports: [StatsComponent],
  templateUrl: './athlete-dashboard.component.html',
  styleUrl: './athlete-dashboard.component.css'
})
export class AthleteDashboardComponent {

}
