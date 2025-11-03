import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-skeleton',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-white rounded-lg shadow-md overflow-hidden animate-pulse">
      <!-- Image skeleton -->
      <div class="w-full h-64 bg-gray-200"></div>

      <!-- Content skeleton -->
      <div class="p-4 space-y-3">
        <!-- Title -->
        <div class="h-5 bg-gray-200 rounded w-3/4"></div>

        <!-- Author -->
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>

        <!-- Rating & Status -->
        <div class="flex gap-2">
          <div class="h-4 bg-gray-200 rounded w-20"></div>
          <div class="h-4 bg-gray-200 rounded w-16"></div>
        </div>

        <!-- Genre tags -->
        <div class="flex gap-2">
          <div class="h-6 bg-gray-200 rounded w-16"></div>
          <div class="h-6 bg-gray-200 rounded w-20"></div>
        </div>

        <!-- Progress bar -->
        <div class="h-2 bg-gray-200 rounded w-full"></div>
      </div>
    </div>
  `,
  styles: [`
    @keyframes pulse {
      0%, 100% {
        opacity: 1;
      }
      50% {
        opacity: 0.5;
      }
    }

    .animate-pulse {
      animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
    }
  `]
})
export class BookSkeletonComponent {
  @Input() count: number = 1;
}
