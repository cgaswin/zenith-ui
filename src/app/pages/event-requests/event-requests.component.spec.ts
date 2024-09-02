import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventRequestsComponent } from './event-requests.component';

describe('EventRequestsComponent', () => {
  let component: EventRequestsComponent;
  let fixture: ComponentFixture<EventRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
