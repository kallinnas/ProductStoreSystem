import { NgModule } from '@angular/core';
import { GeneralModule } from '../../modules/general.module';
import { DisplayConnectionStatusRoutingModule } from './display-connection-status-routing.module';


@NgModule({
  imports: [GeneralModule, DisplayConnectionStatusRoutingModule]
})
export class DisplayConnectionStatusModule { }
