import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomePrimengComponent } from './home-primeng.component';

describe('HomePrimengComponent', () => {
  let component: HomePrimengComponent;
  let fixture: ComponentFixture<HomePrimengComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePrimengComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomePrimengComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
