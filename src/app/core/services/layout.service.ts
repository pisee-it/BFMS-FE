import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LayoutService {
  readonly isSidebarCollapsed = signal(false);

  toggleSidebar(): void {
    this.isSidebarCollapsed.update(state => !state);
  }

  setSidebarCollapsed(value: boolean): void {
    this.isSidebarCollapsed.set(value);
  }
}
