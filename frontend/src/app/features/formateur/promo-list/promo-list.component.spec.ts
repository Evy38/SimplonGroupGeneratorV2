import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PromoListComponent } from './promo-list.component';
import { provideHttpClient } from '@angular/common/http';

describe('PromoListComponent', () => {
  let component: PromoListComponent;
  let fixture: ComponentFixture<PromoListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PromoListComponent],
      providers: [provideHttpClient()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PromoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
