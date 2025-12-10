import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameScreen} from './game-screen/game-screen';
import { PokemonDetails } from "./pokemon-details/pokemon-details";
import { Counter } from './counter/counter';
import { Timer } from './timer/timer';
import { GameStore } from '../../service/game-store';
import { EndGameModal } from '../end-game-modal/end-game-modal';
import { PokemonData } from '../../types/pokemon';


@Component({
  selector: 'app-user-interface',
  imports: [CommonModule, GameScreen, PokemonDetails, Counter, Timer, EndGameModal],
  templateUrl: './user-interface.html',
  styleUrl: './user-interface.scss',
})
export class UserInterface {
  selectedPokemonId?: number;
  selectedPokemonPosX?: number;
  selectedPokemonPosY?: number;
  constructor(public store: GameStore){}

  onRandomPokemon(pokemon: PokemonData) {
  this.selectedPokemonId = pokemon.id;
  this.selectedPokemonPosX = pokemon.posX;
  this.selectedPokemonPosY = pokemon.posY;

}
}
