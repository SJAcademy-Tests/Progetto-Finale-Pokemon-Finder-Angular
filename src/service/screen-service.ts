import { Injectable } from '@angular/core';
import { fromEvent, Observable } from 'rxjs';
import { map, startWith, shareReplay } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ScreenService {
  screenSize$: Observable<{ width: number; height: number }>;

  constructor() {
    this.screenSize$ = fromEvent(window, 'resize').pipe(
      startWith(null),
      map(() => ({
        width: window.innerWidth,
        height: window.innerHeight,
      })),
      shareReplay(1)
    );
  }
}
