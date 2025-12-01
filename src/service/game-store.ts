import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStore {
  navbarHeight = signal<number>(0);
  detailsHeight = signal<number>(0);

  name = signal<string | null>(null);

  setName(s: string) {
    this.name.set(s);
  }
  //variabili di gioco
  pokemonCounter = signal<number>(0);
  timer = signal<number>(200);
  endGame = signal<boolean>(false);

  setEndGame() {
    this.endGame.set(true);

    const leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');

    localStorage.setItem(
      'leaderboard',
      JSON.stringify([
        ...(leaderboard.length ? leaderboard : []),
        {
          name: this.name(),
          score: this.pokemonCounter(),
          played_at: new Date(),
        },
      ].sort((a,b)=> b.score - a.score ))
    );
  }

  updateTimer() {
    this.timer.update((timer) => timer - 1);
  }

  updateTimerOnError() {
    this.timer.update((timer) => timer - 10);
  }

  updateCounter() {
    this.pokemonCounter.update((prev) => prev + 1);
  }
  updateNavbarHeight(h: number) {
    this.navbarHeight.set(h);
  }

  updateDetailsHeight(h: number) {
    this.detailsHeight.set(h);
  }
}
