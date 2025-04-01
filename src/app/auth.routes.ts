import { Routes } from "@angular/router";
import { AuthLayoutComponent } from "./guards/auth/layout/auth-layout/auth-layout.component";
import { LoginPageComponent } from "./store-front/pages/login-page/login-page.component";
import { RegisterPageComponent } from "./store-front/pages/register-page/register-page.component";

export const authRoutes :Routes = [

    {
        path:'',
        component: AuthLayoutComponent,
        children:[
            {
                path:'login',
                component: LoginPageComponent
            },
            {
                path:'register',
                component: RegisterPageComponent
            },
            {
                path:'**',
                redirectTo:'login'
            },
        ]
    }

]

export default authRoutes