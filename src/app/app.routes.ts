import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Saved } from './Components/saved/saved';
import { Settings } from './Components/settings/settings';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        pathMatch: 'full'
    },
    {
        path: 'saved',
        component: Saved
    },
    {
        path: 'settings',
        component: Settings
    }
];
