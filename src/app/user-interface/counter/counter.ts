import { GameStore } from './../../../service/game-store';
import { Component } from '@angular/core';

@Component({
  selector: 'app-counter',
  imports: [],
  templateUrl: './counter.html',
  styleUrl: './counter.scss',
})
export class Counter {
  constructor(public store : GameStore){}
}
