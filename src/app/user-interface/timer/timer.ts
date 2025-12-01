import { Component } from '@angular/core';
import { GameStore } from '../../../service/game-store';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer {
  intervalId: number = 0;

  constructor(public store: GameStore) {}

  ngOnInit() {
    this.intervalId = setInterval(() => {
      this.store.updateTimer();

      if (this.store.timer() <= 0) {
        clearInterval(this.intervalId); // ferma il setInterval
        this.store.setEndGame();
      }
    }, 1000);
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // ferma il setInterval
  }
}
