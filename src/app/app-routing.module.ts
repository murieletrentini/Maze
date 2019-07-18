import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MazeComponent} from './maze/maze.component';
import {TravelingSalesmanComponent} from './traveling-salesman/traveling-salesman.component';
import {StartComponent} from './start/start.component';
import {RandomnessComponent} from './randomness/randomness.component';
import {Ps5Component} from './ps5/ps5.component';

const routes: Routes = [
  {path: '', component: StartComponent},
  {path: 'maze', component: MazeComponent},
  {path: 'salesman', component: TravelingSalesmanComponent},
  {path: 'random', component: RandomnessComponent},
  {path: 'ps5', component: Ps5Component},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
