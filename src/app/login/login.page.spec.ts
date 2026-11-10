import { TestBed } from '@angular/core/testing';
import { RouterModule } from '@angular/router';
import { LoginPageModule } from './login.module';
import { LoginPage } from './login.page';

describe('LoginPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginPageModule, RouterModule.forRoot([])],
    }).compileComponents();
  });

  it('should create', () => {
    const fixture = TestBed.createComponent(LoginPage);
    fixture.detectChanges();
    expect(fixture.componentInstance).toBeTruthy();
  });
});
