import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { GameScreen } from './game-screen/game-screen';

@Component({
  selector: 'app-user-interface',
  imports: [CommonModule, GameScreen],
  templateUrl: './user-interface.html',
  styleUrl: './user-interface.scss',
})
export class UserInterface {
   cards = [
    { title: "Box 1", text: "Testo del box 1" },
    { title: "Box 2", text: "Testo del box 2" },
    { title: "Box 3", text: "Testo del box 3" },
    { title: "Box 4", text: "Testo del box 4" }
  ];
}
