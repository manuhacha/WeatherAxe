import { Routes } from '@angular/router';
import { Home } from './Components/Home/home/home';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        pathMatch: 'full'
    },

];
