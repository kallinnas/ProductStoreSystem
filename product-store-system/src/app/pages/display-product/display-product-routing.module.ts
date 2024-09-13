import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DisplayProductComponent } from "./display-product.component";

const routes: Routes = [{ path: '', component: DisplayProductComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayProductRoutingModule { }