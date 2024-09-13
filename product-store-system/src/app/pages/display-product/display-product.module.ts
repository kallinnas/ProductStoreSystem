import { NgModule } from '@angular/core';
import { GeneralModule } from '../../modules/general.module';
import { DisplayProductRoutingModule } from './display-product-routing.module';


@NgModule({
  imports: [GeneralModule, DisplayProductRoutingModule]
})
export class DisplayProductModule { }
