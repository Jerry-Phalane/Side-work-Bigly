import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IdleTimeoutService } from '../../../shared/services/idle-timeout.service';

@Component({
  selector: 'app-landing-page.component',
  standalone: true,
  imports: [],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.scss'
})
export class LandingPageComponentComponent implements OnInit, OnDestroy {
  constructor(
    private readonly router: Router,
    private readonly idleTimeoutService: IdleTimeoutService
  ) {}

  ngOnInit(): void {
    this.idleTimeoutService.stop();
  }

  ngOnDestroy(): void {
    this.idleTimeoutService.start();
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }
}
