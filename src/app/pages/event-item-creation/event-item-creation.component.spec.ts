import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventItemCreationComponent } from './event-item-creation.component';

describe('EventItemCreationComponent', () => {
  let component: EventItemCreationComponent;
  let fixture: ComponentFixture<EventItemCreationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventItemCreationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventItemCreationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
