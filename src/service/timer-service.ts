import { Injectable, signal } from '@angular/core';
import { GameStore } from './game-store';

@Injectable({
  providedIn: 'root',
})
export class TimerService {
  private intervalId: any = null;

  constructor(public store: GameStore) {}

  timer = signal<number>(150);
  error_timer = signal<boolean>(false);
  correct_timer = signal<boolean>(false);

  startTimer() {
    // STOP vecchio timer prima di crearne uno nuovo
    this.stopTimer();

    this.intervalId = setInterval(() => {
      this.updateTimer();

      if (this.timer() <= 0) {
        clearInterval(this.intervalId);
        this.intervalId = null;
        this.store.setEndGame();
      }
    }, 1000);
  }

  stopTimer() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  updateTimer() {
    this.timer.update((timer) => timer - 1);
  }

  updateTimerOnError() {
    this.timer.update((timer) => timer - 10);
    this.error_timer.set(true);
    setTimeout(() => {
      this.error_timer.set(false);
    }, 140);
  }
  updateTimerOnCorrect() {
    this.timer.update((timer) => timer + 5);
    this.correct_timer.set(true);
    setTimeout(() => {
      this.correct_timer.set(false);
    }, 140);
  }
}
