import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';

interface TicketServiceCard {
  title: string;
  description: string;
  icon: string;
  availabilityIcon: string;
  primaryActionLabel: string;
  secondaryActionLabel?: string;
  availabilityLabel: string;
  availabilityValue: string;
}

const BOOKING_TICKETING_CARDS: readonly TicketServiceCard[] = [
  {
    title: 'Visit the pharmacy',
    description: 'Get a prescription or self medication',
    icon: 'link',
    availabilityIcon: 'schedule',
    primaryActionLabel: 'Join the queue',
    availabilityLabel: 'Estimated waiting time:',
    availabilityValue: '5 minutes'
  },
  {
    title: 'See the nurse',
    description: "A nurse can help if you're sick, need contraception or ongoing care. A doctor is available online if needed",
    icon: 'medical_services',
    availabilityIcon: 'calendar_month',
    primaryActionLabel: 'Check in',
    secondaryActionLabel: 'Make a booking',
    availabilityLabel: 'Next available time:',
    availabilityValue: 'Today 1 PM'
  },
  {
    title: 'See the financial adviser',
    description: 'Get professional help when choosing medical or funeral cover, and life insurance',
    icon: 'verified_user',
    availabilityIcon: 'calendar_month',
    primaryActionLabel: 'Check in',
    secondaryActionLabel: 'Make a booking',
    availabilityLabel: 'Next available time:',
    availabilityValue: 'Monday 2:30 PM'
  }
];

@Component({
  selector: 'app-booking-ticketing',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './booking-ticketing.component.html',
  styleUrl: './booking-ticketing.component.scss'
})
export class BookingTicketingComponent {
  readonly cards: readonly TicketServiceCard[] = BOOKING_TICKETING_CARDS;
}
