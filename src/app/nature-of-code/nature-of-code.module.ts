import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {NatureOfCodeRoutingModule} from './nature-of-code-routing.module';
import {NatureOfCodeComponent} from './nature-of-code.component';
import {SharedModule} from '../shared/shared.module';
import {MaterialModule} from '../shared/material.module';


@NgModule({
  declarations: [
    NatureOfCodeComponent
  ],
  imports: [
    CommonModule,
    NatureOfCodeRoutingModule,
    SharedModule,
    MaterialModule
  ]
})
export class NatureOfCodeModule { }
