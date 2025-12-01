import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';

interface Player {
  name: string;
  score: number;
  played_at: Date;
}

@Component({
  selector: 'app-high-score',
  templateUrl: './high-score.html',
  styleUrls: ['./high-score.scss'],
  imports:[DatePipe]
})
export class HighScore {
  leaderboard: Player[] = [];
  ngOnInit() {
    this.leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');
  }
}
