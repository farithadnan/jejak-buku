import { LoadingService } from './loading.service';

describe('LoadingService', () => {
  let service: LoadingService;

  beforeEach(() => {
    service = new LoadingService();
  });

  it('should start with loading$ as false', (done) => {
    service.loading$.subscribe(value => {
      expect(value).toBeFalse();
      done();
    });
  });

  it('should set loading$ to true after show()', (done) => {
    service.show();
    service.loading$.subscribe(value => {
      expect(value).toBeTrue();
      done();
    });
  });

  it('should set loading$ to false after show() then hide()', (done) => {
    service.show();
    service.hide();
    service.loading$.subscribe(value => {
      expect(value).toBeFalse();
      done();
    });
  });

  it('should require multiple hide() calls if show() called multiple times', () => {
    service.show();
    service.show();
    service.hide();
    // Should still be true after one hide
    expect((service as any).loadingSubject.getValue()).toBeTrue();
    // After second hide, should be false
    service.hide();
    expect((service as any).loadingSubject.getValue()).toBeFalse();
  });

  it('should forceHide() to false regardless of show/hide count', (done) => {
    service.show();
    service.show();
    service.forceHide();
    service.loading$.subscribe(value => {
      expect(value).toBeFalse();
      done();
    });
  });
});