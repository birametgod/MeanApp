import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Post } from '../post';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { mimeType } from './mime-type.validator';
@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {
  postEdit: Post;
  isLoading = false;
  imagePreview: any;
  private mode = 'created';
  form: FormGroup;
  private postId: string;
  constructor(private postService: PostService, private router: ActivatedRoute, private route: Router) {}

  ngOnInit() {
    this.form = new FormGroup({
      name: new FormControl(null, { validators: [Validators.required, Validators.minLength(3)] }),
      post: new FormControl(null, { validators: [Validators.required] }),
      image: new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });
    this.router.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.mode = 'edit';
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postService.getPostId(this.postId).subscribe(postData => {
          this.isLoading = false;
          this.postEdit = {
            id: postData._id,
            name: postData.name,
            post: postData.post,
            imagePath: postData.imagePath,
            creator: postData.creator
          };
          this.form.setValue({ name: this.postEdit.name, post: this.postEdit.post, image: this.postEdit.imagePath });
        });
      } else {
        this.mode = 'created';
        this.postId = null;
        this.postEdit = null;
      }
    });
  }

  onImagePicked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.mode === 'created') {
      this.postService.addPost(this.form.value.name, this.form.value.post, this.form.value.image);
    } else {
      this.postService.updatePost(this.postId, this.form.value.name, this.form.value.post, this.form.value.image);
    }
    this.form.reset();
  }
}
