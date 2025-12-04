import { Component } from '@angular/core';
import { GameStore } from '../../service/game-store';
import { RouterLink } from "@angular/router";
import { ReplayService } from '../../service/replay-service';

@Component({
  selector: 'app-end-game-modal',
  imports: [RouterLink],
  templateUrl: './end-game-modal.html',
  styleUrl: './end-game-modal.scss',
})
export class EndGameModal {
  constructor(public store : GameStore, public replay:ReplayService){}
  handleClick(){
    this.replay.replay()
  }
  handleNewPlayer(){
    window.location.reload()
  }
}
