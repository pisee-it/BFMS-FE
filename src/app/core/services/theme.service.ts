import { Injectable, effect, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { StoreService } from './store.service';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private readonly platformId = inject(PLATFORM_ID);
  private readonly store = inject(StoreService);
  
  theme = this.store.theme;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      // Effect to update DOM
      effect(() => {
        const currentTheme = this.theme();
        
        if (currentTheme === 'dark') {
          document.documentElement.classList.add('dark');
          document.documentElement.setAttribute('data-theme', 'dark');
        } else {
          document.documentElement.classList.remove('dark');
          document.documentElement.setAttribute('data-theme', 'light');
        }
      });
    }
  }

  toggleTheme() {
    this.store.setTheme(this.theme() === 'light' ? 'dark' : 'light');
  }

  setTheme(theme: Theme) {
    this.store.setTheme(theme);
  }
}
