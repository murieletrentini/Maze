import {NgModule} from '@angular/core';
import {Ng5SliderModule} from 'ng5-slider';
import {NgxChartsModule} from '@swimlane/ngx-charts';


const MODULES = [
  Ng5SliderModule,
  NgxChartsModule
];

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class SharedModule {
}
