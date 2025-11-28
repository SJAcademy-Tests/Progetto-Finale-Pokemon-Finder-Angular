import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameScreen, PokemonData } from './game-screen/game-screen';
import { PokemonDetails } from "./pokemon-details/pokemon-details";

@Component({
  selector: 'app-user-interface',
  imports: [CommonModule, GameScreen, PokemonDetails],
  templateUrl: './user-interface.html',
  styleUrl: './user-interface.scss',
})
export class UserInterface {
  selectedPokemonId?: number;
  selectedPokemonPosX?: number;
  selectedPokemonPosY?: number;

  onRandomPokemon(pokemon: PokemonData) {
  this.selectedPokemonId = pokemon.id;
  this.selectedPokemonPosX = pokemon.posX;
  this.selectedPokemonPosY = pokemon.posY;

  console.log('Pokemon selezionato:', pokemon);
}
}
