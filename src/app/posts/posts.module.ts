import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { PostCreateComponent } from './post-create/post-create.component';
import { DatePostedComponent } from './post-list/date-posted/date-posted.component';
import { PostDetailsComponent } from './post-details/post-details.component';
import { PostListComponent } from './post-list/post-list.component';
import { AngularMaterialModule } from './../angular-material.module';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    PostCreateComponent,
    DatePostedComponent,
    PostListComponent,
    PostDetailsComponent
  ],
  imports: [
    CommonModule,
    AngularMaterialModule,
    RouterModule,
    ReactiveFormsModule
  ]
})
export class PostsModule {
}
