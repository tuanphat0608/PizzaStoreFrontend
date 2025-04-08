import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ReviewListComponent } from './components/review-list/review-list.component';

const routes: Routes = [
  {
    path: '',
    component: ReviewListComponent,
    data: {
      pageTitle: 'Quản lí nhận xét',
    },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReviewRoutingModule {}
