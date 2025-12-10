import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavBar } from './nav-bar/nav-bar';
import { Footer } from './footer/footer';
import { GameStore } from '../service/game-store';
import { NewPlayerModal } from './new-player-modal/new-player-modal';
import { PokemonSet } from '../service/pokemon-set';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar, Footer, NewPlayerModal ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Progetto-Finale');
constructor(public store: GameStore, public pokeSet: PokemonSet) {
  this.pokeSet.initialize();
}

}
