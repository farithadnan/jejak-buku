import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading-spinner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex items-center justify-center w-full h-full" [class]="containerClass">
      <div class="flex flex-col items-center justify-center">
        <!-- Spinner -->
        <div
          class="animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"
          [style.width.px]="size"
          [style.height.px]="size"
        ></div>
        <!-- Optional text -->
        <div *ngIf="text" class="mt-2 text-sm text-gray-600 text-center">
          {{ text }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .animate-spin {
      animation: spin 1s linear infinite;
    }

    @keyframes spin {
      from { transform: rotate(0deg); }
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoadingSpinner {
  @Input() size: number = 32;
  @Input() text: string = '';
  @Input() containerClass: string = 'py-8';
}
