import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { Router } from '@angular/router';
import { IdleTimeoutService } from '../../../shared/services/idle-timeout.service';

interface HomeActionCard {
  id: string;
  title: string;
  titleAccent?: string;
  titleAfterAccent?: string;
  titleSuffix?: string;
  subtitle: string;
  buttonLabel: string;
  footerLabel?: string;
  route?: string;
  icon: string;
  image?: string;
  featured?: boolean;
}

@Component({
  selector: 'app-landing-home',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './landing-home.component.html',
  styleUrl: './landing-home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LandingHomeComponent {
  private readonly idleTimeoutService = inject(IdleTimeoutService);
  private readonly router = inject(Router);

  constructor() {
    this.idleTimeoutService.start();
  }

  readonly cards: ReadonlyArray<HomeActionCard> = [
    {
      id: 'better-rewards',
      title: 'How to',
      titleAccent: 'save big',
      titleAfterAccent: 'with',
      titleSuffix: 'Better Rewards',
      subtitle: 'Find out how instant savings and discounts stack with every shop',
      buttonLabel: 'Show me',
      footerLabel: 'Get Better Rewards',
      route: '/landing-home/better-rewards',
      icon: 'local_offer',
      image: 'images/better-rewards.png',
      featured: true
    },
    {
      id: 'pharmacy-queue',
      title: 'Visit the pharmacy',
      subtitle: 'Grab a ticket. A pharmacist will help you in a moment.',
      buttonLabel: 'Join the queue',
      icon: 'medical_services'
    },
    {
      id: 'financial-services',
      title: 'Financial services',
      subtitle: 'Explore our medical and funeral cover, and life insurance services',
      buttonLabel: 'Learn more',
      icon: 'favorite'
    },
    {
      id: 'nurse-or-advisor',
      title: 'See a nurse or advisor',
      subtitle: 'Get trusted nurse-led care or professional financial advice',
      buttonLabel: 'Book an appointment',
      icon: 'add_box'
    },
    {
      id: 'whats-hot-today',
      title: "What's hot today",
      subtitle: 'Find the best deals on your go-to brands',
      buttonLabel: 'Browse promos',
      icon: 'shopping_bag'
    }
  ];

  onCardAction(card: HomeActionCard): void {
    if (!card.route) {
      return;
    }

    this.router.navigateByUrl(card.route);
  }
}
