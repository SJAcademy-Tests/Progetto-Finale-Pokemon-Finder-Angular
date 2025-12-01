import { Component } from '@angular/core';
import { GameStore } from '../../service/game-store';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-end-game-modal',
  imports: [RouterLink],
  templateUrl: './end-game-modal.html',
  styleUrl: './end-game-modal.scss',
})
export class EndGameModal {
  constructor(public store : GameStore){}
  handleClick(){
    window.location.reload()
  }
}
