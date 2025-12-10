import {
  Component,
  Output,
  EventEmitter,
  ViewChildren,
  QueryList,
  effect,
  OnInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { PokemonCell } from './pokemon-cell/pokemon-cell';
import { GameStore } from '../../../service/game-store';
import { TimerService } from '../../../service/timer-service';
import { PokemonSet } from '../../../service/pokemon-set';
import { ScreenService } from '../../../service/screen-service';
import { type PokemonData } from '../../../types/pokemon';
import { fromEvent, Subscription } from 'rxjs';
import { PokemonDaTrovare } from '../../../utils/variabiliGlobali';

@Component({
  selector: 'app-game-screen',
  imports: [PokemonCell],
  templateUrl: './game-screen.html',
  styleUrls: ['./game-screen.scss'],
})
export class GameScreen implements OnInit, OnDestroy {
  @ViewChildren(PokemonCell) pokemonCells!: QueryList<PokemonCell>;

  selectedPokemonFinalPos = signal<{ x: number; y: number } | null>(null);
  flashSignal = signal(false);

  Colonne =  PokemonDaTrovare / 10;

  @Output() randomPokemon = new EventEmitter<PokemonData>();

  private screenSub?: Subscription;

  constructor(
    private store: GameStore,
    public timer: TimerService,
    public pokeSet: PokemonSet,
    private screenService: ScreenService
  ) {
    // Aggiorna posizione quando cambia la finestra
    this.screenSub = this.screenService.screenSize$.subscribe(() => {
      this.recalculateSelectedPokemonPosition();
    });

    // Aggiorna posizione allo scroll della pagina
    fromEvent(window, 'scroll').subscribe(() => {
      this.recalculateSelectedPokemonPosition();
    });
    // Effetto principale per primo Pokémon selezionato
    effect(() => {
      const array = this.pokeSet.finalPokemonSetSignal();
      const positionsReady = array.length > 0 && array.some((p) => p.posX !== 0 || p.posY !== 0);

      if (positionsReady && this.pokeSet.randomPokemonSignal() === null) {
        this.pokeSet.pickRandomPokemon(null);
      }

      const selected = this.pokeSet.randomPokemonSignal();
      if (!selected) return;

      const navbarHeight = this.store.navbarHeight();
      const detailsHeight = this.store.detailsHeight();
      if (navbarHeight === 0 || detailsHeight === 0) return;

      const data = array.find((p) => p.id === selected.id);
      if (!data) return;

      this.selectedPokemonFinalPos.set({
        x: data.posX,
        y: data.posY + navbarHeight + detailsHeight,
      });
    });

    // Effetto per ricalcolare la posizione del Pokémon selezionato dal DOM
    effect(() => {
      const selected = this.pokeSet.randomPokemonSignal();
      if (!selected) return;

      queueMicrotask(() => {
        this.recalculateSelectedPokemonPosition();
      });
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.recalculateSelectedPokemonPosition();
    },500)
    
    // Aggiorna posizione quando cambia la finestra
    this.screenSub = this.screenService.screenSize$.subscribe(() => {
      this.recalculateSelectedPokemonPosition();
    });

    // Aggiorna posizione allo scroll della pagina
    fromEvent(window, 'scroll').subscribe(() => {
      this.recalculateSelectedPokemonPosition();
    });
  }

  ngOnDestroy() {
    this.screenSub?.unsubscribe();
  }

  onPokemonPositionChange(updated: PokemonData) {
    // Aggiorna l'array finale dei Pokémon
    this.pokeSet.finalPokemonSetSignal.update((arr) =>
      arr.map((p) => (p.id === updated.id ? updated : p))
    );

    // Aggiorna la posizione del Pokémon selezionato
    const selected = this.pokeSet.randomPokemonSignal();
    if (selected && selected.id === updated.id) {
      const navbarHeight = this.store.navbarHeight();
      const detailsHeight = this.store.detailsHeight();

      this.selectedPokemonFinalPos.set({
        x: updated.posX,
        y: updated.posY + navbarHeight + detailsHeight,
      });
    }
  }

  private recalculateSelectedPokemonPosition() {
    const selected = this.pokeSet.randomPokemonSignal();
    if (!selected) return;

    const cell = this.pokemonCells?.find?.((c) => c.pokemon?.id === selected.id);
    if (!cell?.elRef?.nativeElement) return;

    const rect = cell.elRef.nativeElement.getBoundingClientRect();

    this.selectedPokemonFinalPos.set({
      x: rect.left + rect.width / 2,
      y: rect.top + rect.height / 2,
    });
  }

  handleClick(event: MouseEvent) {
    const selectedFinal = this.selectedPokemonFinalPos();
    if (!selectedFinal) return;

    const dx = Math.abs(event.clientX - selectedFinal.x);
    const dy = Math.abs(event.clientY - selectedFinal.y);
    const tolerance = 70;

    if (dx <= tolerance && dy <= tolerance) {
      const foundId = this.pokeSet.randomPokemonSignal()?.id;

      // Flash overlay
      this.flashSignal.set(true);
      setTimeout(() => this.flashSignal.set(false), 240);

      // Seleziona nuovo Pokémon
      this.pokeSet.selectNewPokemonAfterFound(foundId ?? null);
      this.store.updateCounter();
      this.timer.updateTimerOnCorrect();
    } else {
      this.timer.updateTimerOnError();
    }
  }
}
