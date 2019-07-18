import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {NatureOfCodeComponent} from './nature-of-code.component';


const routes: Routes = [
  {path: '', component: NatureOfCodeComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NatureOfCodeRoutingModule {
}
