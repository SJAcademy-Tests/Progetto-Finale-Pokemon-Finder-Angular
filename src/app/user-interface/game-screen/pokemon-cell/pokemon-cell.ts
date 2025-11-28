import { Component, EventEmitter, Input, Output, ElementRef, AfterViewInit } from '@angular/core';
import { PokemonData } from '../game-screen';

@Component({
  selector: 'app-pokemon-cell',
  imports: [],
  templateUrl: './pokemon-cell.html',
  styleUrl: './pokemon-cell.scss',
})
export class PokemonCell implements AfterViewInit {
  @Input() pokemon: PokemonData = {
    id: 1,
    posX: 0,
    posY: 0
  };

  @Output() positionChange = new EventEmitter<PokemonData>();

  constructor(private elRef: ElementRef) {}

  ngAfterViewInit() {
    // appena il componente è renderizzato, aggiorna la posizione
    this.updatePosition();
  }

  updatePosition() {
    const rect = this.elRef.nativeElement.getBoundingClientRect();
    this.pokemon.posX = rect.left + 140;
    this.pokemon.posY = rect.top + 30;
    this.positionChange.emit({ ...this.pokemon });
  }
}
