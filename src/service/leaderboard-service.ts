import { Injectable } from '@angular/core';
import { Apollo, gql } from 'apollo-angular';
import { BehaviorSubject, tap } from 'rxjs';

interface Player {
  id: number;
  nome: string;
  punteggio: number;
  curr_date: string;
}

@Injectable({ providedIn: 'root' })
export class LeaderboardService {
  private leaderboardSubject = new BehaviorSubject<Player[]>([]);
  leaderboard$ = this.leaderboardSubject.asObservable();

  constructor(private apollo: Apollo) {}

  refreshLeaderboard() {
    this.apollo
      .query<{ classifica: Player[] }>({
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
        fetchPolicy: 'network-only',
      })
      .subscribe((result) => {
        const players = result.data?.classifica || [];
        this.leaderboardSubject.next(players.filter((p): p is Player => !!p));
      });
  }

  addPlayer(nome: string, punteggio: number, curr_date: string) {
    return this.apollo
      .mutate({
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
        variables: { nome, punteggio, curr_date },
      })
      .pipe(
        tap(() => this.refreshLeaderboard()) // aggiorna automaticamente
      );
  }

  deletePlayer(id: number) {
    return this.apollo
      .mutate({
        mutation: gql`
          mutation ($id: Int!) {
            deleteEntry(id: $id)
          }
        `,
        variables: { id },
      })
      .pipe(tap(() => this.refreshLeaderboard()));
  }
}
