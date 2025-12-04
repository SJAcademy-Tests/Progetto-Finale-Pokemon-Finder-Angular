import { Injectable } from '@angular/core';
import { GameStore } from './game-store';
import { TimerService } from './timer-service';

@Injectable({
  providedIn: 'root',
})
export class ReplayService {
  constructor(public store: GameStore, public timer:TimerService){}

  replay(){
    this.timer.stopTimer();  
    this.timer.timer.set(200);

    this.store.endGame.set(false);
    this.store.pokemonCounter.set(0);
    
    this.timer.startTimer();
  }
}
