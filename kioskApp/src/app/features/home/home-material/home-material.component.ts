import { Component, TemplateRef, ViewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogConfig, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IdleTimeoutService } from '../../../shared/services/idle-timeout.service';
import { BookingTicketingComponent } from '../booking-ticketing/booking-ticketing.component';

type ServiceView = 'iframe' | 'component' | 'disabled';

interface HomeService {
  title: string;
  subtitle: string;
  logo: string;
  icon: string;
  link: string | null;
  external: boolean;
  view: ServiceView;
}

interface PromoPoint {
  highlight: string;
  text: string;
}

const HOME_SERVICES: readonly HomeService[] = [
  /*
  { title: 'Better Rewards', subtitle: 'Explore Better Rewards', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischem.co.za/better-rewards', external: true, view: 'iframe' },
  { title: 'Life Cover Exploration', subtitle: 'Explore Dis-Chem Life Cover', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischem.co.za/dischemlife', external: true, view: 'iframe' },
  { title: 'Life Cover Callback Form', subtitle: 'Open the Life Cover callback form', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischemlife.co.za/i/forms/servicing/?t=caeb611b-7ab3-43db-a578-a3d0402e1ef8', external: true, view: 'iframe' },
  { title: 'Health Cover Exploration', subtitle: 'Explore health insurance options', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischem.co.za/health-insurance', external: true, view: 'iframe' },
  { title: 'Health Cover Callback Form', subtitle: 'Open the health cover callback form', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://instoreleads.dischemhealth.co.za', external: true, view: 'iframe' },
  { title: 'Qmatic', subtitle: 'URL pending', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: null, external: true, view: 'disabled' },
  { title: 'Loyalty Sim', subtitle: 'URL pending', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: null, external: true, view: 'disabled' },
  { title: 'Product Catalogue', subtitle: 'Browse health and wellness products', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischem.co.za/shop-by-department/health-and-wellness', external: true, view: 'iframe' },
  */
  { title: 'Booking and Ticketing', subtitle: 'Get a dispensary ticket or book at the clinic', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: null, external: false, view: 'component' },
  { title: 'Health Cover', subtitle: 'Discover health plans today', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://instoreleads.dischemhealth.co.za', external: true, view: 'iframe' },
  { title: 'Life Cover', subtitle: 'Discover life insurance options', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischemlife.co.za/i/forms/servicing/?t=caeb611b-7ab3-43db-a578-a3d0402e1ef8', external: true, view: 'iframe' },
  { title: 'Store Info', subtitle: 'Discover the products you need', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: null, external: false, view: 'disabled' }
];

const PROMO_POINTS: readonly PromoPoint[] = [
  { highlight: '10% Off', text: 'on 140+ brands, online and in-store' },
  { highlight: '+5% off', text: 'for 30 days when you purchase from the pharmacy' },
  { highlight: '+5% off', text: 'when you pay with your Capitec card' }
];

@Component({
  selector: 'app-home-material',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatCardModule, BookingTicketingComponent],
  templateUrl: './home-material.component.html',
  styleUrl: './home-material.component.scss'
})
export class HomeMaterialComponent {
  private readonly bookingAndTicketingTitle = 'Booking and Ticketing';
  private readonly endSessionConfirmationMessage = 'Ending your session will close this service and return to the kiosk home screen.';
  private readonly endSessionConfirmationTitle = 'End Session';
  private readonly componentDialogConfig = {
    disableClose: true,
    autoFocus: false,
    restoreFocus: false,
    panelClass: 'material-dialog-demo'
  } as const;
  private readonly iframeDialogConfig = {
    disableClose: true,
    delayFocusTrap: true,
    autoFocus: 'dialog' as const,
    restoreFocus: false,
    panelClass: 'material-dialog-demo'
  } as const;

  private materialDialogRef: MatDialogRef<unknown> | null = null;
  @ViewChild('materialDialogTemplate') materialDialogTemplate?: TemplateRef<unknown>;
  @ViewChild('confirmationDialogTemplate') confirmationDialogTemplate?: TemplateRef<unknown>;

  constructor(
    private readonly router: Router,
    private readonly sanitizer: DomSanitizer,
    private readonly idleTimeoutService: IdleTimeoutService,
    private readonly materialDialog: MatDialog
  ) {
    effect(() => {
      if (this.idleTimeoutService.isIdle()) {
        this.closeModal();
        this.router.navigate(['/']);
      }
    });
  }

  readonly services: readonly HomeService[] = HOME_SERVICES;
  readonly promoPoints: readonly PromoPoint[] = PROMO_POINTS;
  readonly dialogSubtitle = 'Tap "End Session" to return to the kiosk home screen.';

  selectedServiceTitle = '';
  selectedServiceUrl: SafeResourceUrl | null = null;
  isBookingTicketingModal = false;

  openService(service: HomeService): void {
    if (this.isBookingAndTicketingService(service)) {
      this.selectedServiceTitle = service.title;
      this.selectedServiceUrl = null;
      this.isBookingTicketingModal = true;
      this.openDialogTemplate('component');
      return;
    }

    if (this.isServiceDisabled(service)) {
      return;
    }

    if (service.view === 'component') {
      this.selectedServiceTitle = service.title;
      this.selectedServiceUrl = null;
      this.isBookingTicketingModal = true;
      this.openDialogTemplate('component');
      return;
    }

    const link = service.link;
    if (!link) {
      return;
    }

    this.selectedServiceTitle = service.title;
    this.selectedServiceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
    this.isBookingTicketingModal = false;
    this.openDialogTemplate('iframe');
  }

  openMaterialModal(service: HomeService): void {
    this.openService(service);
  }

  isServiceDisabled(service: HomeService): boolean {
    return service.view === 'disabled';
  }

  closeModal(): void {
    this.materialDialogRef?.close();
    this.selectedServiceTitle = '';
    this.selectedServiceUrl = null;
    this.isBookingTicketingModal = false;
  }

  confirmEndSession(): void {
    this.openConfirmationDialog(this.endSessionConfirmationTitle, this.endSessionConfirmationMessage);
  }

  endSession(): void {
    this.closeModal();
    this.router.navigate(['/']);
  }

  goToInit(): void {
    this.router.navigate(['/']);
  }

  private openDialogTemplate(dialogType: 'component' | 'iframe'): void {
    this.materialDialogRef?.close();
    if (!this.materialDialogTemplate) {
      return;
    }

    const dialogConfig = {
      ...(dialogType === 'component' ? this.componentDialogConfig : this.iframeDialogConfig),
      ...this.getResponsiveDialogSizeConfig()
    };
    this.materialDialogRef = this.materialDialog.open(this.materialDialogTemplate, dialogConfig);
    this.materialDialogRef.afterClosed().subscribe(() => {
      this.materialDialogRef = null;
    });
  }

  private isBookingAndTicketingService(service: HomeService): boolean {
    return service.title === this.bookingAndTicketingTitle;
  }

  private getResponsiveDialogSizeConfig(): Pick<MatDialogConfig, 'width' | 'maxWidth' | 'height' | 'maxHeight'> {
    const isPortrait = window.matchMedia('(orientation: portrait)').matches;
    if (isPortrait) {
      return {
        width: '96vw',
        maxWidth: '96vw',
        height: '86dvh',
        maxHeight: '86dvh'
      };
    }

    return {
      width: '98vw',
      maxWidth: '98vw',
      height: '96dvh',
      maxHeight: '96dvh'
    };
  }

  private openConfirmationDialog(title: string, message: string): void {
    if (!this.confirmationDialogTemplate) {
      return;
    }

    const confirmationRef = this.materialDialog.open(this.confirmationDialogTemplate, {
      width: '420px',
      maxWidth: '90vw',
      disableClose: true,
      data: { title, message }
    });

    confirmationRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
      if (!confirmed) {
        return;
      }
      this.endSession();
    });
  }
}
