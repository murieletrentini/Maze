import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {MazeComponent} from './maze/maze.component';
import {CanvasComponent} from './maze/canvas/canvas.component';
import {MaterialModule} from './shared/material.module';
import {FormsModule} from '@angular/forms';
import {TravelingSalesmanComponent} from './traveling-salesman/traveling-salesman.component';
import {StartComponent} from './start/start.component';

@NgModule({
  declarations: [
    AppComponent,
    MazeComponent,
    CanvasComponent,
    TravelingSalesmanComponent,
    StartComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
