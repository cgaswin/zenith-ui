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
import { EventCreateComponent } from './pages/event-create/event-create.component';
import { EventItemCreationComponent } from './pages/event-item-creation/event-item-creation.component';
import { EventDetailComponent } from './pages/event-detail/event-detail.component';
import { NewsComponent } from './pages/news/news.component';
import { StatsComponent } from './pages/stats/stats.component';
import { MyEventsComponent } from './pages/my-events/my-events.component';
import { EventResultsComponent } from './pages/event-results/event-results.component';


export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'events', component: EventsComponent },
      {path: 'events/:id',component: EventDetailComponent},
      { path: 'athletes', component: AthletesComponent },
      { path: 'coaches', component: CoachesComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'results/:id', component: EventResultsComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'news', component: NewsComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'statistics', component: StatsComponent },
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
            path: '',
            component: AdminDashboardComponent,
            canActivate: [roleGuard],
            data: { role: 'ADMIN' }
          },
          {
            path: '',
            component: CoachDashboardComponent,
            canActivate: [roleGuard],
            data: { role: 'COACH' }
          },
          {
            path: '',
            component: AthleteDashboardComponent,
            canActivate: [roleGuard],
            data: { role: 'ATHLETE' }
          },
        ]
      },
      {
        path: 'events',
        component: EventsComponent
      },
      {
        path: 'events/create',
        component: EventCreateComponent,
        canActivate: [roleGuard],
        data: { role: 'ADMIN' },
      },
      {
        path: 'events/:id/items',
        component: EventItemCreationComponent,
        canActivate: [roleGuard],
        data: { role: 'ADMIN' }
      },
      { path: 'profile', component: ProfileComponent },
      { path: 'profile/:id', component: ProfileComponent },
      { path: 'events', component: EventsComponent },
      {path: 'events/:id',component: EventDetailComponent},
      { path: 'athletes', component: AthletesComponent },
      { path: 'coaches', component: CoachesComponent },
      { path: 'results', component: ResultsComponent },
      { path: 'results/:id', component: EventResultsComponent },
      {
        path: 'my-events',
        component: MyEventsComponent,
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
        path: 'registration-requests',
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
