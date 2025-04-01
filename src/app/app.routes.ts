import { Routes } from '@angular/router';
import { NotAuthenticatedGuard } from './guards/notAuthenticated.guard';

export const routes: Routes = [


    {
        path:'auth',
        loadChildren: ()=> import('./auth.routes'),
        canMatch: [
            NotAuthenticatedGuard
        ]
    },

    {
        path:'admin',
        loadChildren: ()=> import('./admin-dashboard/dashboard.routes'),
    },

    {
        path:'',
        loadChildren: ()=> import('./store-front/store-front.routes')
    },


];
