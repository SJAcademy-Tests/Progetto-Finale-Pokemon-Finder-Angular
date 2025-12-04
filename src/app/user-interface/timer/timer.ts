import { Component } from '@angular/core';
import { GameStore } from '../../../service/game-store';
import { TimerService } from '../../../service/timer-service';

@Component({
  selector: 'app-timer',
  imports: [],
  templateUrl: './timer.html',
  styleUrl: './timer.scss',
})
export class Timer {
  intervalId: number = 0;

  constructor(public timer: TimerService) {}

  ngOnInit() {
    this.timer.startTimer();
  }

  ngOnDestroy() {
    clearInterval(this.intervalId); // ferma il setInterval
  }
}
