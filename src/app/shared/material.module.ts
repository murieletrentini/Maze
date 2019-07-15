import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatBottomSheetModule, MatButtonModule, MatIconModule, MatInputModule, MatRadioModule} from '@angular/material';
import {Ng5SliderModule} from 'ng5-slider';
import {NgxChartsModule} from '@swimlane/ngx-charts';

const MODULES = [
  BrowserAnimationsModule,
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatRadioModule,
  MatBottomSheetModule,
  Ng5SliderModule,
  NgxChartsModule
];

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class MaterialModule {
}
