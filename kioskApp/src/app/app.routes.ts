import { Routes } from '@angular/router';
import { LandingPageComponentComponent } from './features/home/landing-page/landing-page.component';
import { HomeComponentComponent } from './features/home/home/home.component';
import { HomeMaterialComponent } from './features/home/home-material/home-material.component';
import { HomePrimengComponent } from './features/home/home-primeng/home-primeng.component';

export const routes: Routes = [

    {
        path: '',
        component: LandingPageComponentComponent
    },
    {
        path: 'home',
        component: HomeComponentComponent
    },
    {
        path: 'home-material',
        component: HomeMaterialComponent
    },
    {
        path: 'home-primeng',
        component: HomePrimengComponent
    },

];

//router outlets with router ids
//redux devtools