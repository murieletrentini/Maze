import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MazeComponent} from './maze.component';
import {CanvasComponent} from './canvas/canvas.component';
import {MaterialModule} from '../shared/material.module';
import {SharedModule} from '../shared/shared.module';
import {MazeRoutingModule} from './maze-routing.module';


@NgModule({
  declarations: [
    MazeComponent,
    CanvasComponent,

  ],
  imports: [
    CommonModule,
    MazeRoutingModule,
    MaterialModule,
    SharedModule
  ]
})
export class MazeModule {
}
