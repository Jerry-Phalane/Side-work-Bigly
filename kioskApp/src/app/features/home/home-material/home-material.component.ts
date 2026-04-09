import { Component, TemplateRef, ViewChild, effect } from '@angular/core';
import { Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { IdleTimeoutService } from '../../../shared/services/idle-timeout.service';

@Component({
  selector: 'app-home-material',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule, MatCardModule],
  templateUrl: './home-material.component.html',
  styleUrl: './home-material.component.scss'
})
export class HomeMaterialComponent {
  private readonly materialDialogConfig = {
    width: '95vw',
    height: '92vh',
    maxWidth: '95vw',
    disableClose: true,
    panelClass: 'material-dialog-demo'
  } as const;

  private materialDialogRef: MatDialogRef<unknown> | null = null;
  @ViewChild('materialDialogTemplate') materialDialogTemplate?: TemplateRef<unknown>;

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

  readonly services: readonly HomeService[] = [
    { title: 'Better Rewards', subtitle: 'Explore Better Rewards', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischem.co.za/better-rewards', external: true },
    { title: 'Life Cover Exploration', subtitle: 'Explore Dis-Chem Life Cover', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischem.co.za/dischemlife', external: true },
    { title: 'Life Cover Callback Form', subtitle: 'Open the Life Cover callback form', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischemlife.co.za/i/forms/servicing/?t=caeb611b-7ab3-43db-a578-a3d0402e1ef8', external: true },
    { title: 'Health Cover Exploration', subtitle: 'Explore health insurance options', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischem.co.za/health-insurance', external: true },
    { title: 'Health Cover Callback Form', subtitle: 'Open the health cover callback form', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://instoreleads.dischemhealth.co.za', external: true },
    { title: 'Qmatic', subtitle: 'URL pending', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: null, external: true },
    { title: 'Loyalty Sim', subtitle: 'URL pending', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: null, external: true },
    { title: 'Product Catalogue', subtitle: 'Browse health and wellness products', logo: 'assets/images/logo.png', icon: 'images/Vector.png', link: 'https://www.dischem.co.za/shop-by-department/health-and-wellness', external: true },
  ];

  readonly promoPoints: readonly PromoPoint[] = [
    { highlight: '10% Off', text: 'on 140+ brands, online and in-store' },
    { highlight: '+5% off', text: 'for 30 days when you purchase from the pharmacy' },
    { highlight: '+5% off', text: 'when you pay with your Capitec card' }
  ];

  selectedServiceTitle = '';
  selectedServiceUrl: SafeResourceUrl | null = null;

  openMaterialModal(service: HomeService): void {
    const link = service.link;
    if (!link) {
      return;
    }

    if (service.external) {
      this.selectedServiceTitle = service.title;
      this.selectedServiceUrl = this.sanitizer.bypassSecurityTrustResourceUrl(link);
      this.materialDialogRef?.close();
      if (!this.materialDialogTemplate) {
        return;
      }

      this.materialDialogRef = this.materialDialog.open(this.materialDialogTemplate, this.materialDialogConfig);
      this.materialDialogRef.afterClosed().subscribe(() => {
        this.materialDialogRef = null;
      });
      return;
    }

    this.router.navigate([link]);
  }

  closeModal(): void {
    this.materialDialogRef?.close();
    this.selectedServiceTitle = '';
    this.selectedServiceUrl = null;
  }

  goToInit(): void {
    this.router.navigate(['/']);
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
