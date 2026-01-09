import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CapitalizePipe } from '../../utils/capitalize-pipe';
import { LeaderboardService, Player } from '../../service/leaderboard-service';

@Component({
  templateUrl: './high-score.html',
  styleUrls: ['./high-score.scss'],
  standalone: true,
  imports: [DatePipe, CapitalizePipe]
})
export class HighScore implements OnInit {
  leaderboard: Player[] = [];

  constructor(
    private leaderboardService: LeaderboardService,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit() {
    this.leaderboardService.leaderboard$.subscribe(players => {
      setTimeout(() => {
        this.leaderboard = players.sort((a, b) => b.punteggio - a.punteggio);

        // forza Angular a rilevare il cambiamento
        this.cd.detectChanges();
      }, 500); // delay 1 secondo per lo spinner
    });

    this.leaderboardService.refreshLeaderboard();
  }

  deletePlayer(id: number) {
    this.leaderboardService.deletePlayer(id).subscribe();
  }
}
