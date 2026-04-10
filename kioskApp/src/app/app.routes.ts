import { Routes } from '@angular/router';
import { LandingPageComponentComponent } from './features/home/landing-page/landing-page.component';
import { HomeMaterialComponent } from './features/home/home-material/home-material.component';
import { HomePrimengComponent } from './features/home/home-primeng/home-primeng.component';
import { LandingHomeComponent } from './features/home/landing-home/landing-home.component';
import { BetterRewardsComponent } from './features/home/landing-home/better-rewards/better-rewards.component';

export const routes: Routes = [

    {
        path: '',
        component: LandingHomeComponent
    },
    {
        path: 'home',
        component: HomeMaterialComponent
    },
    {
        path: 'home-material',
        component: HomeMaterialComponent
    },
    {
        path: 'home-primeng',
        component: HomePrimengComponent
    },
    {
        path: 'landing-home',
        component: LandingHomeComponent
    },
    {
        path: 'landing-home/better-rewards',
        component: BetterRewardsComponent
    },

];

//router outlets with router ids
//redux devtools