import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { PerfilPageModule } from './perfil.module';
import { PerfilPage } from './perfil.page';

describe('PerfilPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PerfilPageModule, RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(PerfilPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
