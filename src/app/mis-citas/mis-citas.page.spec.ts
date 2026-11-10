import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { MisCitasPageModule } from './mis-citas.module';
import { MisCitasPage } from './mis-citas.page';

describe('MisCitasPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MisCitasPageModule, RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(MisCitasPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
