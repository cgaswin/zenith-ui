import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { EventComponent } from './pages/event/event.component';
import { ResultComponent } from './pages/result/result.component';
import { CoachComponent } from './pages/coach/coach.component';
import { AthleteComponent } from './pages/athlete/athlete.component';
import { NavbarComponent } from './navbar/navbar.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet,HomeComponent,EventComponent,ResultComponent,CoachComponent,AthleteComponent,NavbarComponent,SignupComponent,LoginComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'zenith-ui';
}
