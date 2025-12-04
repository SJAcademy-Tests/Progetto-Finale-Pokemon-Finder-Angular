import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { CapitalizePipe } from "../../utils/capitalize-pipe";

interface Player {
  name: string;
  score: number;
  played_at: Date;
}

@Component({
  selector: 'app-high-score',
  templateUrl: './high-score.html',
  styleUrls: ['./high-score.scss'],
  imports: [DatePipe, CapitalizePipe]
})
export class HighScore {
  leaderboard: Player[] = [];
  ngOnInit() {
    this.leaderboard = JSON.parse(localStorage.getItem('leaderboard') || '{}');
  }
}
