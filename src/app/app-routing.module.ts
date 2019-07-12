import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MazeComponent} from './maze/maze.component';
import {TravelingSalesmanComponent} from './traveling-salesman/traveling-salesman.component';
import {StartComponent} from './start/start.component';

const routes: Routes = [
  {path: '', component: StartComponent},
  // {path: '', component: TravelingSalesmanComponent}, //TODO
  {path: 'maze', component: MazeComponent},
  {path: 'salesman', component: TravelingSalesmanComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
