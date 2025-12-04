import { Component, ElementRef, Input, ViewChild, AfterViewInit, OnDestroy } from '@angular/core';
import { PokemonService } from '../../../service/pokemon-service';
import { PokemonType } from '../../../types/pokemon';
import { CommonModule } from '@angular/common';
import { ComponentSize } from '../../../service/component-size';
import { GameStore } from '../../../service/game-store';
import { CapitalizePipe } from "../../../utils/capitalize-pipe";


@Component({
  selector: 'app-pokemon-details',
  standalone: true,
  imports: [CommonModule, CapitalizePipe],
  templateUrl: './pokemon-details.html',
  styleUrls: ['./pokemon-details.scss'],
})
export class PokemonDetails implements AfterViewInit, OnDestroy {
  @ViewChild('detailContainer', { static: true }) detailContainer!: ElementRef<HTMLElement>;

  private stopObserver?: () => void;

  constructor(
    private pokemonService: PokemonService,
    private size: ComponentSize,
    private store: GameStore
  ) {}

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
  getIta(obj: any) {
    const entry = obj.flavor_text_entries?.find((entry: any) => entry.language.name === 'it');
    return entry
      ? entry.flavor_text.replace(/\n|\f/g, ' ')
      : obj.flavor_text_entries?.[0]?.flavor_text.replace(/\n|\f/g, ' ') || 'No description';
  }

  ngAfterViewInit() {
    const el = this.detailContainer.nativeElement;

    const updateHeight = () => {
      const rect = el.getBoundingClientRect();
      const style = getComputedStyle(el);
      const marginTop = parseFloat(style.marginTop);
      const marginBottom = parseFloat(style.marginBottom);

      const totalHeight = rect.height + marginTop + marginBottom;
      if (totalHeight > 0) {
        this.store.updateDetailsHeight(totalHeight);
      }
    };

    // aggiorna subito
    requestAnimationFrame(() => updateHeight());

    // osserva resize
    this.stopObserver = this.size.observeSize(el, (rect: DOMRectReadOnly) => {
      updateHeight();
    });
  }

  ngOnDestroy() {
    if (this.stopObserver) {
      this.stopObserver();
    }
  }
}
