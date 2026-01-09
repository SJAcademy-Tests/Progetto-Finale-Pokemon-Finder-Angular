import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../utils/capitalize-pipe';
import { LeaderboardService } from '../../service/leaderboard-service';

interface Player {
  id: number;
  nome: string;
  punteggio: number;
  curr_date: string;
}

@Component({
  templateUrl: './high-score.html',
  styleUrls: ['./high-score.scss'],
  standalone: true,
  imports: [DatePipe, CapitalizePipe]
})
export class HighScore implements OnInit {
  leaderboard: Player[] = [];
  loading = true

  constructor(private leaderboardService: LeaderboardService) {}

  ngOnInit() {
    this.leaderboardService.leaderboard$.subscribe(players => {
      this.leaderboard = players;
      this.leaderboard.sort((a , b) => b.punteggio - a.punteggio)
      this.loading = false
    });
    this.leaderboardService.refreshLeaderboard();
  }

  deletePlayer(id: number) {
    // elimina e aggiorna automaticamente tramite BehaviorSubject
    this.leaderboardService.deletePlayer(id).subscribe();
  }
}
