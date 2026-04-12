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
      title: 'See how you can',
      titleAccent: 'save big',
      titleAfterAccent: 'with Better',
      titleSuffix: 'Rewards',
      subtitle: "Test out our Better Rewards shopping simulator and we'll prove it",
      buttonLabel: 'Try it out',
      footerLabel: 'Sign up for Better Rewards',
      route: '/landing-home/better-rewards',
      icon: 'local_offer',
      image: 'images/better-rewards.png',
      featured: true
    },
    {
      id: 'pharmacy-queue',
      title: 'Visit the pharmacy or join the queue',
      subtitle: "Test out our Better Rewards shopping simulator and we'll prove it",
      buttonLabel: 'Get a ticket or book a visit',
      icon: 'medical_services'
    },
    {
      id: 'dis-chem-cover',
      title: 'Get Dis-Chem cover',
      subtitle: "Test out our Better Rewards shopping simulator and we'll prove it",
      buttonLabel: 'See cover options',
      icon: 'favorite'
    },
    {
      id: 'learn-about-dis-chem',
      title: 'Learn about Dis-Chem',
      subtitle: "Test out our Better Rewards shopping simulator and we'll prove it",
      buttonLabel: 'Learn more',
      icon: 'add_box'
    },
    {
      id: 'online-store',
      title: 'Shop products',
      subtitle: "Test out our Better Rewards shopping simulator and we'll prove it",
      buttonLabel: 'Try it out',
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
