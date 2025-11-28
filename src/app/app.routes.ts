import { Routes } from '@angular/router';
import { UserInterface } from './user-interface/user-interface';
import { HighScore } from './high-score/high-score';

export const routes: Routes = [
    {
        path:"home",
        component: UserInterface,
    },
    {
        path:"score",
        component: HighScore,
    }
];
