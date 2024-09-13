import { NgModule } from '@angular/core';
import { GeneralModule } from '../../modules/general.module';
import { EditProductRoutingModule } from './edit-product-routing.module';


@NgModule({
  imports: [GeneralModule, EditProductRoutingModule]
})
export class EditProductModule { }
