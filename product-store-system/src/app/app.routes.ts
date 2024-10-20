import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { AuthComponent } from './auth/auth.component';
import { NgModule } from '@angular/core';

export const routes: Routes = [
    { path: '', redirectTo: 'auth', pathMatch: 'full' },
    { path: 'auth', component: AuthComponent },
    { path: 'display-products', loadChildren: () => import('./pages/display-product/display-product.module').then(m => m.DisplayProductModule), canActivate: [AuthGuard] },
    { path: 'edit-products', loadChildren: () => import('./pages/edit-product/edit-product.module').then(m => m.EditProductModule), canActivate: [AuthGuard]},
    { path: 'display-connection-status', loadChildren: () => import('./pages/display-connection-status/display-connection-status.module').then(m => m.DisplayConnectionStatusModule), canActivate: [AuthGuard]},
    { path: '**', redirectTo: 'auth', pathMatch: 'full' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule { }