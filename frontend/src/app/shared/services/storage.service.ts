import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  private isStorageAvailable(): boolean {
    return typeof window !== 'undefined' && !!window.localStorage;
  }

  setItem(key: string, value: string): void {
    if (this.isStorageAvailable()) {
      try {
        localStorage.setItem(key, value);
      } catch (e) {
        // Fail silently
      }
    }
  }

  getItem(key: string): string | null {
    if (this.isStorageAvailable()) {
      try {
        return localStorage.getItem(key);
      } catch (e) {
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isStorageAvailable()) {
      try {
        localStorage.removeItem(key);
      } catch (e) {
        // Fail silently
      }
    }
  }

  clear(): void {
    if (this.isStorageAvailable()) {
      try {
        localStorage.clear();
      } catch (e) {
        // Fail silently
      }
    }
  }
}