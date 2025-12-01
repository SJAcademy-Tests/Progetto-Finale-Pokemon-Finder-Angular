import { Component } from '@angular/core';
import { GameStore } from '../../service/game-store';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-player-modal',
  imports: [FormsModule],
  templateUrl: './new-player-modal.html',
  styleUrl: './new-player-modal.scss',
})
export class NewPlayerModal {
  playerName: string = '';

  constructor(public store:GameStore){}
  submitName() {
    if (!this.playerName.trim()) return; // evita nomi vuoti
    this.store.setName(this.playerName);
    this.playerName = ''; // pulisce l'input dopo submit
  }
}
