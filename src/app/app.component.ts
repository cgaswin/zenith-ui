import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard/admin-dashboard.component';
import { AthleteDashboardComponent } from './pages/dashboard/athlete-dashboard/athlete-dashboard.component';
import { CoachDashboardComponent } from './pages/dashboard/coach-dashboard/coach-dashboard.component';
import { EventsComponent } from './pages/events/events.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { ResultsComponent } from './pages/results/results.component';
import { PublishResultsComponent } from './pages/publish-results/publish-results.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { EventRegistrationComponent } from './pages/event-registration/event-registration.component';
import { EventRequestsComponent } from './pages/event-requests/event-requests.component';
import { EventItemCreationComponent } from './pages/event-item-creation/event-item-creation.component';
import { EventCreateComponent } from './pages/event-create/event-create.component';
import { NewsComponent } from './pages/news/news.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PublicLayoutComponent,
    NavbarComponent,
    SignupComponent,
    LoginComponent,
    DashboardLayoutComponent,
    AdminDashboardComponent,
    HomeComponent,
    AthleteDashboardComponent,
    CoachDashboardComponent,
    EventsComponent,
    ProfileComponent,
    ResultsComponent,
    PublishResultsComponent,
    RequestsComponent,
    EventRegistrationComponent,
    EventRequestsComponent,
    EventItemCreationComponent,
    EventCreateComponent,
    NewsComponent
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'zenith-ui';
}
