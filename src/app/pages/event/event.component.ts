import { Component } from '@angular/core';
import { CardComponent } from '../../components/card/card.component';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [CardComponent],
  templateUrl: './event.component.html',
  styleUrl: './event.component.css'
})
export class EventComponent {

}
