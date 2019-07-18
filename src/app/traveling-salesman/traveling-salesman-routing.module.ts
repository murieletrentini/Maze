import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {TravelingSalesmanComponent} from './traveling-salesman.component';


const routes: Routes = [
  {path: '', component: TravelingSalesmanComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TravelingSalesmanRoutingModule { }
