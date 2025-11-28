import { Component, Output, EventEmitter, signal, effect } from '@angular/core';
import { PokemonCell } from './pokemon-cell/pokemon-cell';

export type PokemonData = {
  id: number;
  posX: number;
  posY: number;
};

@Component({
  selector: 'app-game-screen',
  imports: [PokemonCell],
  templateUrl: './game-screen.html',
  styleUrls: ['./game-screen.scss'],
})
export class GameScreen {
  private _maxPokemonId = 1000;
  maxPokemonNumber = 300;

  pokemonSet = Array.from({ length: this._maxPokemonId }, (_, i) => i + 1);
  finalPokemonSetSignal = signal<PokemonData[]>([]);  // signal per array dinamico

  randomPokemonSignal = signal<PokemonData| null>(null);        // signal per id casuale

  @Output() randomPokemon = new EventEmitter<PokemonData>();

  constructor() {
    effect(() => {
      const array = this.finalPokemonSetSignal();
      if (array.length > 0) {
        const randomIndex = Math.floor(Math.random() * array.length);
        const pokemon = array[randomIndex];
        this.randomPokemonSignal.set(pokemon);
        this.randomPokemon.emit(pokemon);
      }
    });

    this.updatePokemonArray();
  }
  

  updatePokemonArray() {
    const shuffled = this.pokemonSet.sort(() => Math.random() - 0.5);
    const newArray: PokemonData[] = shuffled
      .slice(0, this.maxPokemonNumber)
      .map((id) => ({ id, posX: 0, posY: 0 }));

    this.finalPokemonSetSignal.set(newArray);
  }

    onPokemonPositionChange(updated: PokemonData) {
    this.finalPokemonSetSignal.update((array) =>
      array.map((p) => (p.id === updated.id ? updated : p))
    );
  }
 handleClick(event: MouseEvent) {
  const clickX = event.clientX;
  const clickY = event.clientY;
  const tolerance = 40; // tolleranza in pixel

  const selected = this.randomPokemonSignal(); // il Pokémon selezionato

  if (!selected) return; // nessun Pokémon selezionato

  // controllo se il click è vicino al Pokémon selezionato
  const dx = Math.abs(clickX - selected.posX);
  const dy = Math.abs(clickY - selected.posY);

  if (dx <= tolerance && dy <= tolerance) {
    alert(`Hai trovato il Pokémon ${selected.id}!`);
  } else {
    console.log(`Click fuori: (${clickX.toFixed(2)}, ${clickY.toFixed(2)})`);
  }

  console.log('Click su X:', clickX, 'Y:', clickY);
}

}

