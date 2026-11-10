import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { ReservarCitaPageModule } from './reservar-cita.module';
import { ReservarCitaPage } from './reservar-cita.page';

describe('ReservarCitaPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservarCitaPageModule, RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(ReservarCitaPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
