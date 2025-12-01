import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStore {
  // NAVBAR HEIGHT
  navbarHeight = signal<number>(0);

  // DETAILS HEIGHT
  detailsHeight = signal<number>(0);

  updateNavbarHeight(h: number) {
    this.navbarHeight.set(h);
  }

  updateDetailsHeight(h: number) {
    this.detailsHeight.set(h);
  }
}
