import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IframeModalComponent } from './iframe-modal.component';

describe('IframeModalComponent', () => {
  let component: IframeModalComponent;
  let fixture: ComponentFixture<IframeModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IframeModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IframeModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
