import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './common/guards/auth.guard';
import { OrderComponent } from './order/order.component';

const routes: Routes = [
  {
    path: 'admin',
    children: [
      { path: 'login', component: LoginComponent },
      {
        path: 'order',
        component: OrderComponent,
        canActivate: [AuthGuard]
      },
      { path: '', redirectTo: 'login', pathMatch: 'full' }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
