import { Component, Output, EventEmitter, signal, effect, OnInit } from '@angular/core';
import { PokemonCell } from './pokemon-cell/pokemon-cell';
import { ScreenService } from '../../../service/screen-service';
import { GameStore } from '../../../service/game-store';

export type PokemonData = { id: number; posX: number; posY: number };

@Component({
  selector: 'app-game-screen',
  imports: [PokemonCell],
  templateUrl: './game-screen.html',
  styleUrls: ['./game-screen.scss'],
})
export class GameScreen implements OnInit {
  finalPokemonSetSignal = signal<PokemonData[]>([]);
  randomPokemonSignal = signal<PokemonData | null>(null);
  selectedPokemonFinalPos = signal<{ x: number; y: number } | null>(null);

  screenWidth = signal(0);
  screenHeight = signal(0);

  @Output() randomPokemon = new EventEmitter<PokemonData>();

  constructor(private store: GameStore, private screenService: ScreenService) {
    // 🔹 Scegli Pokémon casuale quando array pronto
    effect(() => {
      const array = this.finalPokemonSetSignal();
      if (array.length > 0 && this.randomPokemonSignal() == null) {
        const randomIndex = Math.floor(Math.random() * array.length);
        const pokemon = array[randomIndex];
        this.randomPokemonSignal.set(pokemon);
        this.randomPokemon.emit(pokemon);
      }
    });

    // 🔹 Aggiorna posizione finale Pokémon selezionato
    effect(() => {
      const selected = this.randomPokemonSignal();
      if (!selected) return;

      const navbarHeight = this.store.navbarHeight();
      const detailsHeight = this.store.detailsHeight();
      if (navbarHeight === 0 || detailsHeight === 0) return;

      const data = this.finalPokemonSetSignal().find(p => p.id === selected.id);
      if (!data) return;

      this.selectedPokemonFinalPos.set({
        x: data.posX,
        y: data.posY + navbarHeight + detailsHeight,
      });
    });

    // 🔹 Gestione resize (senza takeUntilDestroyed)
    screenService.screenSize$.subscribe(size => {
      this.screenWidth.set(size.width);
      this.screenHeight.set(size.height);

      // Aggiorna posizione dei Pokémon se cambia dimensione
      const selected = this.randomPokemonSignal();
      if (!selected) return;

      const navbarHeight = this.store.navbarHeight();
      const detailsHeight = this.store.detailsHeight();
      console.log(detailsHeight)
      const data = this.finalPokemonSetSignal().find(p => p.id === selected.id);
      if (!data) return;

      this.selectedPokemonFinalPos.set({
        x: data.posX + 40,
        y: data.posY + navbarHeight + detailsHeight,
      });
    });
  }

  ngOnInit() {
    this.updatePokemonArray();
  }

  updatePokemonArray() {
    const allPokemonIds = Array.from({ length: 1000 }, (_, i) => i + 1);
    const shuffled = allPokemonIds.sort(() => Math.random() - 0.5);
    const newArray: PokemonData[] = shuffled
      .slice(0, 100)
      .map(id => ({ id, posX: 0, posY: 0 }));
    this.finalPokemonSetSignal.set(newArray);
  }

  onPokemonPositionChange(updated: PokemonData) {
    this.finalPokemonSetSignal.update(arr =>
      arr.map(p => (p.id === updated.id ? updated : p))
    );
  }

  handleClick(event: MouseEvent) {
    const selectedFinal = this.selectedPokemonFinalPos();
    if (!selectedFinal) return;

    const dx = Math.abs(event.clientX  - selectedFinal.x);
    const dy = Math.abs(event.clientY - selectedFinal.y);
    const tolerance = 70;

    console.log('Click dx/dy:', event.clientX, event.clientY);
    console.log('Pokemon posizione finale:', selectedFinal.x, selectedFinal.y);

    if (dx <= tolerance && dy <= tolerance) {
      alert(`Hai trovato il Pokémon ${this.randomPokemonSignal()?.id}!`);
    }
  }
}
