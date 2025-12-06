import { Component } from '@angular/core';
import { TimerService } from '../../../service/timer-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-timer',
  imports: [CommonModule],
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
