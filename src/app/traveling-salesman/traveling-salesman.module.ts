import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {TravelingSalesmanRoutingModule} from './traveling-salesman-routing.module';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../shared/material.module';
import {SettingsComponent} from './settings/settings.component';
import {TravelingSalesmanComponent} from './traveling-salesman.component';
import {ChartComponent} from './chart/chart.component';
import {FormsModule} from '@angular/forms';


@NgModule({
  declarations: [
    TravelingSalesmanComponent,
    ChartComponent,
    SettingsComponent,
  ],
  entryComponents: [SettingsComponent],
  imports: [
    CommonModule,
    TravelingSalesmanRoutingModule,
    MaterialModule,
    SharedModule,
    FormsModule
  ]
})
export class TravelingSalesmanModule {
}
