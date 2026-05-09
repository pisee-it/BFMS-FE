import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  readonly isSidebarCollapsed = signal(window.innerWidth <= 1024);

  constructor() {
    // Optional: update on resize
    window.addEventListener('resize', () => {
      if (window.innerWidth <= 1024) {
        this.isSidebarCollapsed.set(true);
      }
    });
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(state => !state);
  }

  setSidebarCollapsed(value: boolean): void {
    this.isSidebarCollapsed.set(value);
  }
}
