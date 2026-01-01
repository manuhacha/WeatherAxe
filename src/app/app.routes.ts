import { Routes } from '@angular/router';
import { Home } from './Components/home/home';
import { Settings } from './Components/settings/settings';

export const routes: Routes = [
    {
        path: '',
        component: Home,
        pathMatch: 'full'
    },
    {
        path: 'settings',
        component: Settings
    }
];
