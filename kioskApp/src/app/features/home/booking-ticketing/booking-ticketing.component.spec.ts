import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingTicketingComponent } from './booking-ticketing.component';

describe('BookingTicketingComponent', () => {
  let component: BookingTicketingComponent;
  let fixture: ComponentFixture<BookingTicketingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookingTicketingComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingTicketingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
