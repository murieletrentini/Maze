import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MatButtonModule, MatInputModule} from '@angular/material';

const MODULES = [
  BrowserAnimationsModule,
  MatButtonModule,
  MatInputModule
];

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class MaterialModule {
}
