import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EventComponent } from './pages/event/event.component';
import { CoachComponent } from './pages/coach/coach.component';
import { AthleteComponent } from './pages/athlete/athlete.component';
import { ResultComponent } from './pages/result/result.component';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { PublicLayoutComponent } from './layout/public-layout/public-layout.component';


export const routes: Routes = [
  {
    path: '',
    component: PublicLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: 'events', component: EventComponent },
      { path: 'coaches', component: CoachComponent },
      { path: 'athletes', component: AthleteComponent },
      { path: 'results', component: ResultComponent },
      { path: 'login', component: LoginComponent },
      { path: 'signup', component: SignupComponent }
    ]
  },
];
