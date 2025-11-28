import { PokemonCell } from './pokemon-cell/pokemon-cell';
import { Component } from '@angular/core';

export type PokemonData = {
  id: number;
  posX: number;
  posY: number;
};

@Component({
  selector: 'app-game-screen',
  imports: [PokemonCell],
  templateUrl: './game-screen.html',
  styleUrl: './game-screen.scss',
})
export class GameScreen {
  maxPokemonId: number = 1000;
  maxPokemonNumber: number = 10;
  pokemonSet = Array.from({ length: this.maxPokemonId }, (_, i) => i +1)
  pokemonSetRandomized = this.pokemonSet.sort(() => Math.random() - 0.5);
  finalPokemonSet: PokemonData[] = [];

  constructor() {
      this.finalPokemonSet = this.pokemonSetRandomized.slice(0, this.maxPokemonNumber).map((id, index) => {
      const posX = 0;
      const posY = 0;

      return {
        id,
        posX,
        posY,
      };
    });
  }


}
