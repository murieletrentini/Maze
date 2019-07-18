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
import {ChartComponent} from './traveling-salesman/chart/chart.component';
import {SettingsComponent} from './traveling-salesman/settings/settings.component';
import {RandomnessComponent} from './randomness/randomness.component';
import {Ps5Component} from './ps5/ps5.component';

@NgModule({
  declarations: [
    AppComponent,
    MazeComponent,
    CanvasComponent,
    TravelingSalesmanComponent,
    StartComponent,
    ChartComponent,
    SettingsComponent,
    RandomnessComponent,
    Ps5Component
  ],
  entryComponents:  [SettingsComponent],
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
