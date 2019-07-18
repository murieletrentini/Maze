import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {StartComponent} from './start/start.component';

const routes: Routes = [
  {path: '', component: StartComponent},
  {
    path: 'maze',
    loadChildren: () => import('./maze/maze.module').then(mod => mod.MazeModule)
  },
  {
    path: 'salesman',
    loadChildren: () => import('./traveling-salesman/traveling-salesman.module').then(mod => mod.TravelingSalesmanModule)
  },
  {
    path: 'ps5',
    loadChildren: () => import('./nature-of-code/nature-of-code.module').then(mod => mod.NatureOfCodeModule)
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
