import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { EventsComponent } from './pages/events/events.component';
import { AthletesComponent } from './pages/athletes/athletes.component';
import { CoachesComponent } from './pages/coaches/coaches.component';
import { ResultsComponent } from './pages/results/results.component';
import { DashboardLayoutComponent } from './layout/dashboard-layout/dashboard-layout.component';
import { authGuard } from './guards/auth.guard';
import { roleGuard } from './guards/role.guard';
import { AdminDashboardComponent } from './pages/dashboard/admin-dashboard/admin-dashboard.component';
import { CoachDashboardComponent } from './pages/dashboard/coach-dashboard/coach-dashboard.component';
import { AthleteDashboardComponent } from './pages/dashboard/athlete-dashboard/athlete-dashboard.component';
import { ProfileComponent } from './pages/profile/profile.component';
import { RequestsComponent } from './pages/requests/requests.component';
import { PublishResultsComponent } from './pages/publish-results/publish-results.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';
import { EventRegistrationComponent } from './pages/event-registration/event-registration.component';
import { EventRequestsComponent } from './pages/event-requests/event-requests.component';


export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'events', component: EventsComponent },
      { path: 'athletes', component: AthletesComponent },
      { path: 'coaches', component: CoachesComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'profile/:id', component: ProfileComponent },
    ]
  },
  {
    path: 'dashboard',
    component: DashboardLayoutComponent,
    canActivate: [authGuard],
    children: [
      {
        path: '',
        canActivate: [roleGuard],
        children: [
          {
            path: 'admin',
            component: AdminDashboardComponent,
            canActivate: [roleGuard],
            data: { role: 'ADMIN' }
          },
          {
            path: 'coach',
            component: CoachDashboardComponent,
            canActivate: [roleGuard],
            data: { role: 'COACH' }
          },
          {
            path: 'athlete',
            component: AthleteDashboardComponent,
            canActivate: [roleGuard],
            data: { role: 'ATHLETE' }
          },
        ]
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'events', component: EventsComponent },
      { path: 'athletes', component: AthletesComponent },
      { path: 'coaches', component: CoachesComponent },
      { path: 'results', component: ResultsComponent },
      {
        path: 'event-registration',
        component: EventRegistrationComponent,
        canActivate: [roleGuard],
        data: { role: 'ATHLETE' }
      },
      {
        path: 'requests',
        component: RequestsComponent,
        canActivate: [roleGuard],
        data: { role: 'COACH' }
      },
      {
        path: 'event-requests',
        component: EventRequestsComponent,
        canActivate: [roleGuard],
        data: { role: 'ADMIN' }
      },
      {
        path: 'publish-results',
        component: PublishResultsComponent,
        canActivate: [roleGuard],
        data: { role: 'ADMIN' }
      }
    ]
  },
  { path: '**', redirectTo: '' }
];
