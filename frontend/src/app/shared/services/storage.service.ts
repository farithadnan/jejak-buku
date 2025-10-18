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
      localStorage.setItem(key, value);
    }
  }

  getItem(key: string): string | null {
    if (this.isStorageAvailable()) {
      return localStorage.getItem(key);
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isStorageAvailable()) {
      localStorage.removeItem(key);
    }
  }

  clear(): void {
    if (this.isStorageAvailable()) {
      localStorage.clear();
    }
  }
}