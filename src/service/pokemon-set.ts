import { Injectable, signal } from '@angular/core';
import { PokemonData } from '../types/pokemon';
import { PokemonDaTrovare, MaxPokemonID } from '../utils/variabiliGlobali';

@Injectable({
  providedIn: 'root',
})
export class PokemonSet {
  finalPokemonSetSignal = signal<PokemonData[]>([]);
  randomPokemonSignal = signal<PokemonData | null>(null);
  pokemonId = signal<number>(0)

  //Genera un array con il numero di pokemon selezionato
  private initialized = false;

  initialize() {
    if (!this.initialized) {
      this.updatePokemonArray();
      this.initialized = true;
    }
  }

 reset() {
  // Ricrea l'array
  this.updatePokemonArray();

  // Svuota il Pokémon selezionato
  this.randomPokemonSignal.set(null);
  this.pokemonId.set(0);

  // Aspetta che le posizioni siano pronte (gestito dall'effect in GameScreen)
  this.initialized = true;
}

  updatePokemonArray() {
    const allPokemonIds = Array.from({ length: MaxPokemonID }, (_, i) => i + 1);
    const shuffled = allPokemonIds.sort(() => Math.random() - 0.5);

    const newArray: PokemonData[] = shuffled
      .slice(0, PokemonDaTrovare)
      .map((id) => ({ id, posX: 0, posY: 0 }));

    this.finalPokemonSetSignal.set(newArray);
  }

  //sceglie un pokemon random fra quelli presenti nell'array
  pickRandomPokemon(current: any) {
    const array = this.finalPokemonSetSignal();
    const positionsReady = array.length > 0 && array.some((p) => p.posX !== 0 || p.posY !== 0);
    if (!positionsReady) {
      // l'effect già presente si occuperà di selezionare quando le posizioni saranno pronte
      return;
    }

    // scegli un nuovo indice diverso dall'attuale (se possibile)
    if (array.length === 0) return;

    let randomIndex = Math.floor(Math.random() * array.length);
    // evita scegliere lo stesso pokemon appena trovato quando possibile
    if (current && array.length > 1) {
      let attempts = 0;
      while (array[randomIndex].id === current.id && attempts < 10) {
        randomIndex = Math.floor(Math.random() * array.length);
        attempts++;
      }
    }

    const pokemon = array[randomIndex];
    this.pokemonId.set(pokemon.id)
    this.randomPokemonSignal.set(pokemon);
  }

  //sceglie un altro pokemon che non sia quello precedente
  selectNewPokemonAfterFound(foundId: number | null) {
    const prevSignal = this.randomPokemonSignal();
    this.randomPokemonSignal.set(null);
    this.pickRandomPokemon(prevSignal);
  }
}
