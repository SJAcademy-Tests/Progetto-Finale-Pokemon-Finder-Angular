import { LeaderboardService } from './leaderboard-service';
import { capitalize } from '../utils/capitalize';
import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GameStore {
  constructor(public leaderboardService: LeaderboardService) {}
  navbarHeight = signal<number>(0);
  detailsHeight = signal<number>(0);

  //variabili di gioco
  name = signal<string | null>(null);
  pokemonCounter = signal<number>(0);
  endGame = signal<boolean>(false);

  setName(s: string | null) {
    // evita errori se s è null o stringa vuota
    const formatted = s ? capitalize(s) : null;
    this.name.set(formatted);
  }

  setEndGame() {
    this.endGame.set(true);

    if (!this.name()) return;

    const player = {
      nome: this.name()!,
      punteggio: this.pokemonCounter(),
      curr_date: new Date().toISOString(),
    };

    // aggiungi giocatore al backend
    this.leaderboardService.addPlayer(player.nome, player.punteggio, player.curr_date).subscribe({
      next: () => {
        console.log('Giocatore salvato sul backend!');
      },
      error: (err) => console.error('Errore salvataggio backend:', err),
    });
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
