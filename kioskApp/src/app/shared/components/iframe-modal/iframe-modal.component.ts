import { Component, EventEmitter, Input, Output } from '@angular/core';
import { SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-iframe-modal',
  imports: [],
  templateUrl: './iframe-modal.component.html',
  styleUrl: './iframe-modal.component.scss'
})
export class IframeModalComponent {
  @Input() visible = false;
  @Input() title = '';
  @Input() url: SafeResourceUrl | null = null;
  @Output() close = new EventEmitter<void>();

  onClose(): void {
    this.close.emit();
  }
}
