import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PostCreateComponent } from '../post-create/post-create.component';
import { PostListComponent } from '../post-list/post-list.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AngularMaterialModule } from '../angular-material/angular-material.module';
@NgModule({
  declarations: [PostCreateComponent, PostListComponent],
  imports: [CommonModule, ReactiveFormsModule, AngularMaterialModule, RouterModule]
})
export class PostsModule {}
