import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { forkJoin } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PokemonService {
  pokemonDetails = signal<any>(undefined);

  constructor(private http: HttpClient) {
    this.fetchPokemon(0); // id iniziale
  }

  fetchPokemon(id: number) {
    if (id == 0) return;
    const pokemon$ = this.http.get(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const species$ = this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);

    forkJoin([pokemon$, species$]).subscribe({
      next: ([pokemon, species]) => {
        this.pokemonDetails.set({
          ...pokemon,
          ...species,
        });
      },
      error: (err) => {
        console.error('Errore fetch Pokémon:', err);
        this.pokemonDetails.set(undefined);
      },
    });
  }
}
