import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';

import { Post } from './../post.model';
import { PostsService } from '../posts.service';
import { mimeType } from './mime-type.validator';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  enteredTitle = '';
  enteredContent = '';
  post: Post;
  imagePreview = '';

  isLoading = false;
  private mode = 'create';
  private postId: string;
  form: FormGroup;

  constructor(public postsService: PostsService, public route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required]
      }),
      'content': new FormControl(null, {
        validators: [Validators.required]
      }),
      'image': new FormControl(null, {
         asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe(
      (paramMap: ParamMap) => {
        if (paramMap.has('postId')) {
          this.mode = 'edit';
          this.postId = paramMap.get('postId');
          this.isLoading = true;
          this.postsService.getPost(this.postId).subscribe(postData => {
            this.isLoading = false;
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath
            };
            this.form.setValue({
              'title': this.post.title,
              'content': this.post.content,
              'image': this.post.imagePath
            });
            this.imagePreview = this.post.imagePath;
          });
        } else {
          this.mode = 'create';
          this.postId = null;
          this.imagePreview = '';
        }
      });
  }

  onImagePicked(event: Event) {
      const file = (event.target as HTMLInputElement).files[0];
      this.form.patchValue({image: file});
      this.form.get('image').updateValueAndValidity();
      const reader = new FileReader();
      reader.onload = () => {
        this.imagePreview = reader.result as string;
        console.log('this.imagePreview: ' + this.imagePreview);
      };
      reader.readAsDataURL(file);
  }

  onSavePost() {
      if (this.form.invalid) {
        return;
      }
      this.isLoading = true;
      if (this.mode === 'create') {
        const post: Post = {
          id: null,
          title: this.form.value.title,
          content: this.form.value.content,
          imagePath: this.form.value.image
        };
        this.postsService.addPost(post);
      } else {
        const post: Post = {
          id: this.postId,
          title: this.form.value.title,
          content: this.form.value.content,
          imagePath: this.form.value.image
        };
        this.postsService.updatePost(post);
      }
      this.form.reset();
      this.router.navigateByUrl('/');
  }
}
