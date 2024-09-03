import { Component } from '@angular/core';
import { StatsComponent } from '../../stats/stats.component';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [StatsComponent],
  templateUrl: './admin-dashboard.component.html',
  styleUrl: './admin-dashboard.component.css'
})
export class AdminDashboardComponent {

  
}
