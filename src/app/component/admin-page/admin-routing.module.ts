import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AuthGuard } from './common/guards/auth.guard';
import { OrderComponent } from './order/order.component';
import { AdminEntryComponent } from './admin-entry/admin-entry.component';

const routes: Routes = [
  {
    path: 'admin',
    component: AdminEntryComponent,
  },
  {
    path: 'admin/login',
    component: LoginComponent,
  },
  {
    path: 'admin/order',
    component: OrderComponent,
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
