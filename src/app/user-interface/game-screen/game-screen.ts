import {
  Component,
  Output,
  EventEmitter,
  signal,
  effect,
  OnInit,
  ViewChildren,
  QueryList,
} from '@angular/core';
import { PokemonCell } from './pokemon-cell/pokemon-cell';
import { ScreenService } from '../../../service/screen-service';
import { GameStore } from '../../../service/game-store';
import { TimerService } from '../../../service/timer-service';

export type PokemonData = { id: number; posX: number; posY: number };

@Component({
  selector: 'app-game-screen',
  imports: [PokemonCell],
  templateUrl: './game-screen.html',
  styleUrls: ['./game-screen.scss'],
})
export class GameScreen implements OnInit {
  @ViewChildren(PokemonCell) pokemonCells!: QueryList<PokemonCell>;
  finalPokemonSetSignal = signal<PokemonData[]>([]);
  randomPokemonSignal = signal<PokemonData | null>(null);
  selectedPokemonFinalPos = signal<{ x: number; y: number } | null>(null);
  flashSignal = signal(false);

  //screenWidth = signal(0);
  //screenHeight = signal(0);

  @Output() randomPokemon = new EventEmitter<PokemonData>();

  constructor(
    private store: GameStore,
    private screenService: ScreenService,
    public timer: TimerService
  ) {
    effect(() => {
      const array = this.finalPokemonSetSignal();
      // aspetta che l'array sia popolato e che almeno una posizione sia stata calcolata
      const positionsReady = array.length > 0 && array.some((p) => p.posX !== 0 || p.posY !== 0);
      if (positionsReady && this.randomPokemonSignal() == null) {
        this.pickRandomPokemon(null);
      }

      const selected = this.randomPokemonSignal();
      if (!selected) return;

      const navbarHeight = this.store.navbarHeight();
      const detailsHeight = this.store.detailsHeight();
      if (navbarHeight === 0 || detailsHeight === 0) return;

      const data = this.finalPokemonSetSignal().find((p) => p.id === selected.id);

      if (!data) return;

      this.selectedPokemonFinalPos.set({
        x: data.posX,
        y: data.posY + navbarHeight + detailsHeight,
      });
    });

    /* screenService.screenSize$.subscribe(size => {
      this.screenWidth.set(size.width);
      this.screenHeight.set(size.height);

      // Aggiorna posizione dei Pokémon se cambia dimensione
      const selected = this.randomPokemonSignal();
      if (!selected) return;

      const navbarHeight = this.store.navbarHeight();
      const detailsHeight = this.store.detailsHeight();
      const data = this.finalPokemonSetSignal().find(p => p.id === selected.id);
      if (!data) return;

      this.selectedPokemonFinalPos.set({
        x: data.posX + 40,
        y: data.posY + navbarHeight + detailsHeight,
      });
    }); */
  }

  ngOnInit() {
    this.updatePokemonArray();
  }
  MaxPokemonID = 1000;
  PokemonDaTrovare = 200;
  Colonne = this.PokemonDaTrovare / 10;

  updatePokemonArray() {
    const allPokemonIds = Array.from({ length: this.MaxPokemonID }, (_, i) => i + 1);
    const shuffled = allPokemonIds.sort(() => Math.random() - 0.5);
    const newArray: PokemonData[] = shuffled
      .slice(0, this.PokemonDaTrovare)
      .map((id) => ({ id, posX: 0, posY: 0 }));
    this.finalPokemonSetSignal.set(newArray);
  }

  onPokemonPositionChange(updated: PokemonData) {
    this.finalPokemonSetSignal.update((arr) => arr.map((p) => (p.id === updated.id ? updated : p)));

    // If the updated pokemon is the currently selected one, update final pos immediately
    const selected = this.randomPokemonSignal();
    if (selected && selected.id === updated.id) {
      const navbarHeight = this.store.navbarHeight();
      const detailsHeight = this.store.detailsHeight();
      this.selectedPokemonFinalPos.set({
        x: updated.posX + 40,
        y: updated.posY + navbarHeight + detailsHeight,
      });
      console.log(
        'Updated selectedPokemonFinalPos from positionChange:',
        this.selectedPokemonFinalPos()
      );
    }
  }

  handleClick(event: MouseEvent) {
    // Prefer the precomputed final position signal
    let targetX: number | null = null;
    let targetY: number | null = null;

    const selectedFinal = this.selectedPokemonFinalPos();
    if (selectedFinal) {
      targetX = selectedFinal.x;
      targetY = selectedFinal.y;
    } else {
      // If signal not ready, try to read the real DOM element for the selected pokemon
      const selected = this.randomPokemonSignal();
      if (selected) {
        // Prefer getting the element via ViewChildren (safer than querySelector)
        const cell = this.pokemonCells?.find?.((c) => c.pokemon?.id === selected.id);
        if (cell?.elRef?.nativeElement) {
          const rect = cell.elRef.nativeElement.getBoundingClientRect();
          // use element center (already viewport coordinates)
          targetX = rect.left + rect.width / 2;
          targetY = rect.top + rect.height / 2;
        } else {
          // fallback to reading stored data (may be stale)
          const data = this.finalPokemonSetSignal().find((p) => p.id === selected.id);
          if (data) {
            const navbarHeight = this.store.navbarHeight();
            const detailsHeight = this.store.detailsHeight();
            targetX = data.posX + 40;
            targetY = data.posY + navbarHeight + detailsHeight;
          }
        }
      }
    }

    if (targetX === null || targetY === null) return;

    const dx = Math.abs(event.clientX - targetX);
    const dy = Math.abs(event.clientY - targetY);
    const tolerance = 70;

    if (dx <= tolerance && dy <= tolerance) {
      const foundId = this.randomPokemonSignal()?.id;
      // show flash and select a new pokemon
      this.flashSignal.set(true);
      setTimeout(() => {
        this.flashSignal.set(false);
      }, 240);
      this.selectNewPokemonAfterFound(foundId ?? null);
      this.store.updateCounter();
    } else {
      this.timer.updateTimerOnError();
    }
  }

  private selectNewPokemonAfterFound(foundId: number | null) {
    const prevSignal = this.randomPokemonSignal();
    this.randomPokemonSignal.set(null);
    this.pickRandomPokemon(prevSignal);
  }

  private pickRandomPokemon(current: any) {
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
    this.randomPokemonSignal.set(pokemon);
    this.randomPokemon.emit(pokemon);
  }
}
