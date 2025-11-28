import { Component, Input } from '@angular/core';
import { PokemonData } from '../game-screen';

@Component({
  selector: 'app-pokemon-cell',
  imports: [],
  templateUrl: './pokemon-cell.html',
  styleUrl: './pokemon-cell.scss',
})
export class PokemonCell {
 @Input() pokemon: PokemonData = {
  id:1,
  posX: 0,
  posY: 0
 }
}

