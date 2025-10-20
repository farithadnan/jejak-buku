import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;

  beforeEach(() => {
    service = new StorageService();
    localStorage.clear();
  });

  it('should set and get an item', () => {
    service.setItem('testKey', 'testValue');
    expect(service.getItem('testKey')).toBe('testValue');
  });

  it('should return null for non-existent key', () => {
    expect(service.getItem('missingKey')).toBeNull();
  });

  it('should remove an item', () => {
    service.setItem('removeKey', 'value');
    service.removeItem('removeKey');
    expect(service.getItem('removeKey')).toBeNull();
  });

  it('should clear all items', () => {
    service.setItem('a', '1');
    service.setItem('b', '2');
    service.clear();
    expect(service.getItem('a')).toBeNull();
    expect(service.getItem('b')).toBeNull();
  });

  it('should not throw if localStorage is unavailable', () => {
    // Spy on localStorage methods to throw errors
    spyOn(localStorage, 'setItem').and.throwError('localStorage unavailable');
    spyOn(localStorage, 'getItem').and.throwError('localStorage unavailable');
    spyOn(localStorage, 'removeItem').and.throwError('localStorage unavailable');
    spyOn(localStorage, 'clear').and.throwError('localStorage unavailable');

    expect(() => service.setItem('x', 'y')).not.toThrow();
    expect(service.getItem('x')).toBeNull();
    expect(() => service.removeItem('x')).not.toThrow();
    expect(() => service.clear()).not.toThrow();
  });
});