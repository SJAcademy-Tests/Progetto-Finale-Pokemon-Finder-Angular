import { Component, EventEmitter, Input, Output, ElementRef, AfterViewInit } from '@angular/core';
import { PokemonData } from '../../../../types/pokemon';


@Component({
  selector: 'app-pokemon-cell',
  templateUrl: './pokemon-cell.html',
  styleUrls: ['./pokemon-cell.scss'],
})
export class PokemonCell implements AfterViewInit {

  @Input() pokemon: PokemonData = {
    id: 1,
    posX: 0,
    posY: 0
  };

  @Output() positionChange = new EventEmitter<PokemonData>();

  constructor(public elRef: ElementRef) {}

  ngAfterViewInit() {
    // aggiorna UNA sola volta dopo il render
    this.updatePosition();
  }

  updatePosition() {
    const rect = this.elRef.nativeElement.getBoundingClientRect();


    this.pokemon.posX = rect.left
    this.pokemon.posY = rect.top
    //console.log(this.pokemon.posX, this.pokemon.posY)
    this.positionChange.emit({ ...this.pokemon });
  }
}
