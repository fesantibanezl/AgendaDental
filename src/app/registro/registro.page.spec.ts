import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { RegistroPageModule } from './registro.module';
import { RegistroPage } from './registro.page';

describe('RegistroPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegistroPageModule, RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(RegistroPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
