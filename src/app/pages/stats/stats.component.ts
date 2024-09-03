import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { EventService } from '../../service/event.service';
import { AthleteService } from '../../service/athlete.service';
import { CoachService } from '../../service/coach.service';
import { forkJoin } from 'rxjs';
import { Chart, ChartConfiguration } from 'chart.js/auto';


interface StatsData {
  events: { total: number, dailyCounts: { [key: string]: number } };
  athletes: { total: number, dailyCounts: { [key: string]: number } };
  coaches: { total: number, dailyCounts: { [key: string]: number } };
}
@Component({
  selector: 'app-stats',
  standalone: true,
  imports: [],
  templateUrl: './stats.component.html',
  styleUrl: './stats.component.css'
})
export class StatsComponent implements OnInit, AfterViewInit {
  @ViewChild('eventsChart') eventsChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('athletesChart') athletesChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('coachesChart') coachesChartRef!: ElementRef<HTMLCanvasElement>;

  stats: StatsData = {
    events: { total: 0, dailyCounts: {} },
    athletes: { total: 0, dailyCounts: {} },
    coaches: { total: 0, dailyCounts: {} }
  };
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private eventService: EventService,
    private athleteService: AthleteService,
    private coachService: CoachService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.loadStats();
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  loadStats() {
    forkJoin({
      events: this.eventService.getEventStats(),
      athletes: this.athleteService.getAthleteStats(),
      coaches: this.coachService.getCoachStats()
    }).subscribe({
      next: (results) => {
        this.stats = {
          events: results.events.data,
          athletes: results.athletes.data,
          coaches: results.coaches.data
        };
        this.loading = false;
        this.cdr.detectChanges(); // Trigger change detection
        this.renderCharts();
      },
      error: (error) => {
        this.error = 'Failed to load statistics';
        this.loading = false;
        console.error('Error loading statistics:', error);
      }
    });
  }

  renderCharts() {
    if (this.eventsChartRef?.nativeElement) {
      this.createChart(this.eventsChartRef.nativeElement, this.stats.events.dailyCounts, 'Events', 'rgb(75, 192, 192)');
    }
    if (this.athletesChartRef?.nativeElement) {
      this.createChart(this.athletesChartRef.nativeElement, this.stats.athletes.dailyCounts, 'Athletes', 'rgb(255, 99, 132)');
    }
    if (this.coachesChartRef?.nativeElement) {
      this.createChart(this.coachesChartRef.nativeElement, this.stats.coaches.dailyCounts, 'Coaches', 'rgb(54, 162, 235)');
    }
  }

  createChart(canvas: HTMLCanvasElement, data: { [key: string]: number }, label: string, color: string) {
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const sortedDates = Object.keys(data).sort();
    const chartData = sortedDates.map(date => data[date]);

    new Chart(ctx, {
      type: 'line',
      data: {
        labels: sortedDates,
        datasets: [{
          label: label,
          data: chartData,
          borderColor: color,
          tension: 0.1
        }]
      },
      options: {
        responsive: true,
        scales: {
          y: {
            beginAtZero: true
          }
        }
      }
    });
  }
}
