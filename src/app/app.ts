import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { UserInterface } from './user-interface/user-interface';
import { HighScore } from './high-score/high-score';
import { NavBar } from './nav-bar/nav-bar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavBar ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('Progetto-Finale');
}
