import {NgModule} from '@angular/core';
import {MatBottomSheetModule, MatButtonModule, MatIconModule, MatInputModule, MatRadioModule} from '@angular/material';

const MODULES = [
  MatButtonModule,
  MatInputModule,
  MatIconModule,
  MatRadioModule,
  MatBottomSheetModule
];

@NgModule({
  declarations: [],
  imports: MODULES,
  exports: MODULES,
})
export class MaterialModule {
}
