import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatToolbarModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatDialogModule
} from '@angular/material';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatPaginatorModule,
    MatToolbarModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    MatButtonModule
  ]
})
export class AngularMaterialModule {}
