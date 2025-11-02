import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Layout } from './layout';
import { provideRouter } from '@angular/router';

describe('Layout', () => {
  let component: Layout;
  let fixture: ComponentFixture<Layout>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Layout],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(Layout);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home when logo is clicked', () => {
    const logoLink = fixture.nativeElement.querySelector('.logo-container a');
    expect(logoLink).toBeTruthy();
    expect(logoLink.getAttribute('routerLink')).toBe('/');
  });

  it('should display current year and app title in footer', () => {
    const footer = fixture.nativeElement.querySelector('footer');
    expect(footer.textContent).toContain(new Date().getFullYear().toString());
    expect(footer.textContent).toContain('Jejak Buku');
  });

  it('should contain a router-outlet', () => {
    const outlet = fixture.nativeElement.querySelector('router-outlet');
    expect(outlet).toBeTruthy();
  });
});
