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
      subtitle: 'Find out how instant savings and discounts can stack every time you shop',
      buttonLabel: 'Show me',
      footerLabel: 'Get Better Rewards',
      route: '/landing-home/better-rewards',
      icon: 'local_offer',
      image: 'images/better-rewards.png',
      featured: true
    },
    {
      id: 'pharmacy-queue',
      title: 'Visit the pharmacy or join the queue (kiosk)',
      subtitle: 'Two lines',
      buttonLabel: 'Get a ticket or book a visit',
      icon: 'medical_services'
    },
    {
      id: 'dis-chem-cover',
      title: 'Get Dis-Chem cover',
      subtitle: 'Use kiosk',
      buttonLabel: 'See cover options',
      icon: 'favorite'
    },
    {
      id: 'learn-about-dis-chem',
      title: 'Learn about Dis-Chem',
      subtitle: 'More info',
      buttonLabel: 'Learn more',
      icon: 'add_box'
    },
    {
      id: 'online-store',
      title: 'Online store',
      subtitle: 'Shop online',
      buttonLabel: 'Shop now',
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
