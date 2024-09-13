import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";
import { DisplayConnectionStatusComponent } from "./display-connection-status.component";

const routes: Routes = [{ path: '', component: DisplayConnectionStatusComponent }];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class DisplayConnectionStatusRoutingModule { }