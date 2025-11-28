import { Component, Input, OnInit } from '@angular/core';
import { PokemonService } from '../../../service/pokemon-service';
import { PokemonType } from '../../../types/pokemon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-details.html',
  styleUrl: './pokemon-details.scss',
})
export class PokemonDetails {
  constructor(private pokemonService: PokemonService) {}

  @Input() posX?: number;
  @Input() posY?: number;

  @Input() set id(value: number | undefined) {
    if (value) {
      this.pokemonService.fetchPokemon(value);
    }
  }
  get pokemon(): PokemonType {
    return this.pokemonService.pokemonDetails();
  }
  capitalize(name: string) {
    return name.charAt(0).toUpperCase() + name.slice(1);
  }
  getIta(obj: any) {
    const entry = obj.flavor_text_entries?.find((entry: any) => entry.language.name === 'it');
    return entry
      ? entry.flavor_text.replace(/\n|\f/g, ' ')
      : obj.flavor_text_entries?.[0]?.flavor_text.replace(/\n|\f/g, ' ') || 'No description';
  }
}
