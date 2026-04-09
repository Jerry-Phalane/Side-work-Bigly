import { Component, effect } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { IframeModalComponent } from '../../../shared/components/iframe-modal/iframe-modal.component';
import { IdleTimeoutService } from '../../../shared/services/idle-timeout.service';

@Component({
  selector: 'app-home.component',
  standalone: true,
  imports: [IframeModalComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponentComponent {
  constructor(
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly idleTimeoutService: IdleTimeoutService
  ) {
    effect(() => {
      if (this.idleTimeoutService.isIdle()) {
        this.closeModal();
        this.router.navigate(['/']);
      }
    });
  }

  readonly services: readonly HomeService[] = [
    /*
    {
      title: 'Better Rewards',
      subtitle: 'Explore Better Rewards',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: 'https://www.dischem.co.za/better-rewards',
      external: true
    },
    {
      title: 'Life Cover Exploration',
      subtitle: 'Explore Dis-Chem Life Cover',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: 'https://www.dischem.co.za/dischemlife',
      external: true
    },
    {
      title: 'Life Cover Callback Form',
      subtitle: 'Open the Life Cover callback form',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: 'https://www.dischemlife.co.za/i/forms/servicing/?t=caeb611b-7ab3-43db-a578-a3d0402e1ef8',
      external: true
    },
    {
      title: 'Health Cover Exploration',
      subtitle: 'Explore health insurance options',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: 'https://www.dischem.co.za/health-insurance',
      external: true
    },
    {
      title: 'Health Cover Callback Form',
      subtitle: 'Open the health cover callback form',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: 'https://instoreleads.dischemhealth.co.za',
      external: true
    },
    {
      title: 'Qmatic',
      subtitle: 'URL pending',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: null,
      external: true
    },
    {
      title: 'Loyalty Sim',
      subtitle: 'URL pending',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: null,
      external: true
    },
    {
      title: 'Product Catalogue',
      subtitle: 'Browse health and wellness products',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: 'https://www.dischem.co.za/shop-by-department/health-and-wellness',
      external: true
    },
    */
    {
      title: 'Booking and Ticketing',
      subtitle: 'Get a dispensary ticket or book at the clinic',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: null,
      external: true
    },
    {
      title: 'Health Cover',
      subtitle: 'Discover health plans today',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: 'https://instoreleads.dischemhealth.co.za',
      external: true
    },
    {
      title: 'Life Cover',
      subtitle: 'Discover life insurance options',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: 'https://www.dischemlife.co.za/i/forms/servicing/?t=caeb611b-7ab3-43db-a578-a3d0402e1ef8',
      external: true
    },
    {
      title: 'Store Info',
      subtitle: 'Discover the products you need',
      logo: 'assets/images/logo.png',
      icon: 'images/Vector.png',
      link: null,
      external: true
    }
  ];
  
  readonly promoPoints: readonly PromoPoint[] = [
    {
      highlight: '10% Off',
      text: 'on 140+ brands, online and in-store'
    },
    {
      highlight: '+5% off',
      text: 'for 30 days when you purchase from the pharmacy'
    },
    {
      highlight: '+5% off',
      text: 'when you pay with your Capitec card'
    }
  ];

  isModalVisible = false;
  selectedServiceTitle = '';
  selectedServiceUrl: SafeResourceUrl | null = null;
  get secondsRemaining() {
    return this.idleTimeoutService.secondsRemaining;
  }

  get isWarning() {
    return this.idleTimeoutService.isWarning;
  }

  openCustomModal(service: HomeService): void {
    const link = this.getServiceLink(service);
    if (!link) {
      return;
    }

    if (service.external) {
      this.setSelectedService(service.title, link);
      this.isModalVisible = true;
    } else {
      this.router.navigate([link]);
    }
  }

  closeModal(): void {
    this.isModalVisible = false;
    this.selectedServiceTitle = '';
    this.selectedServiceUrl = null;
  }

  stayActive(): void {
    this.idleTimeoutService.reset();
  }

  goToInit(): void {
    this.router.navigate(['/']);
  }

  goToMaterialDemo(): void {
    this.router.navigate(['/home-material']);
  }

  goToPrimeDemo(): void {
    this.router.navigate(['/home-primeng']);
  }

  private getServiceLink(service: HomeService): string | null {
    return service.link;
  }

  private setSelectedService(title: string, link: string): void {
    this.selectedServiceTitle = title;
    this.selectedServiceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
  }
}

interface HomeService {
  title: string;
  subtitle: string;
  logo: string;
  icon: string;
  link: string | null;
  external: boolean;
}

interface PromoPoint {
  highlight: string;
  text: string;
}
