import { Injectable } from '@angular/core';
import { GameStore } from './game-store';
import { TimerService } from './timer-service';
import { PokemonSet } from './pokemon-set';

@Injectable({
  providedIn: 'root',
})
export class ReplayService {
  constructor(public store: GameStore, public timer:TimerService, public pokeSet : PokemonSet){}

  replay(){
    this.pokeSet.reset();
    this.timer.stopTimer();  
    this.timer.timer.set(150);

    this.store.endGame.set(false);
    this.store.pokemonCounter.set(0);
    
    this.timer.startTimer();

  }
}
