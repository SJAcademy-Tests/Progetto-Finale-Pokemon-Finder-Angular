import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, tap } from 'rxjs';

export interface Player {
  id: number;
  nome: string;
  punteggio: number;
  curr_date: string;
}

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private _leaderboard$ = new BehaviorSubject<Player[]>([]);
  leaderboard$ = this._leaderboard$.asObservable();

  constructor(private apollo: Apollo) {}

  refreshLeaderboard() {
    this.apollo
      .watchQuery<{ classifica: Player[] }>({
        query: gql`
          query {
            classifica {
              id
              nome
              punteggio
              curr_date
            }
          }
        `,
        fetchPolicy: 'network-only'
      })
      .valueChanges
      .subscribe({
        next: result => {
          const players: Player[] = (result.data?.classifica || [])
            .filter((p): p is Player => !!p)
            .sort((a, b) => b.punteggio - a.punteggio);

          // aggiorna il BehaviorSubject dopo 1 secondo
          setTimeout(() => {
            this._leaderboard$.next(players);
          }, 1000);
        },
        error: err => {
          console.error('Errore caricamento leaderboard', err);
          setTimeout(() => this._leaderboard$.next([]), 1000);
        }
      });
  }

  addPlayer(nome: string, punteggio: number, curr_date: string) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($nome: String!, $punteggio: Int!, $curr_date: String!) {
          addUser(nome: $nome, punteggio: $punteggio, curr_date: $curr_date) {
            id
            nome
            punteggio
            curr_date
          }
        }
      `,
      variables: { nome, punteggio, curr_date }
    }).pipe(
      tap(() => this.refreshLeaderboard()) // aggiorna leaderboard dopo aggiunta
    );
  }

  deletePlayer(id: number) {
    return this.apollo.mutate({
      mutation: gql`
        mutation ($id: Int!) {
          deleteEntry(id: $id)
        }
      `,
      variables: { id }
    }).pipe(
      tap(() => this.refreshLeaderboard()) // aggiorna leaderboard dopo eliminazione
    );
  }
}
