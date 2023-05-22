// angular import
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'signin',
        loadComponent: () => import('./auth-signin-v2/auth-signin-v2.component')
      },
      {
        path: 'reset-password',
        loadComponent: () => import('./auth-reset-password-v2/auth-reset-password-v2.component')
      },
      {
        path: 'change-password',
        loadComponent: () => import('./auth-change-password/auth-change-password.component')
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AuthenticationRoutingModule {}
