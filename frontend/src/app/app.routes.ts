import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUp } from './sign-up/sign-up';

export const routes: Routes = [
    { path: 'login', component: LoginComponent },
    { path: 'signup', component: SignUp },
    { path: "", redirectTo: '/login', pathMatch: 'full' },
];