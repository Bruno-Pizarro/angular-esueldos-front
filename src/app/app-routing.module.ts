import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from 'src/app/components/not-found/not-found.component';
import { AuthResolver } from 'src/app/resolvers';
import { AuthGuard } from 'src/app/services';

const routes: Routes = [
  { path: '', redirectTo: 'products', pathMatch: 'full' },
  {
    path: 'auth',
    loadChildren: () => import('./modules').then((m) => m.AuthModule),
  },
  {
    path: '',
    canActivate: [AuthGuard],
    children: [
      {
        path: 'products',
        loadChildren: () => import('./modules').then((m) => m.ProductsModule),
        resolve: { userData: AuthResolver },
      },
      {
        path: 'users',
        loadChildren: () => import('./modules').then((m) => m.UserModule),
        resolve: { userData: AuthResolver },
        data: { expectedRole: 'admin' },
      },
    ],
  },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
