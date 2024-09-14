import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FlexLayoutServerModule } from '@angular/flex-layout/server';
// import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from './material.module';


@NgModule({
  exports: [CommonModule, ReactiveFormsModule, FormsModule, FlexLayoutModule, FlexLayoutServerModule, MaterialModule]
})
export class GeneralModule { }
