import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Post } from '../post';
import { PostService } from '../post.service';
import { Subject, Subscription } from 'rxjs';
import { PageEvent } from '@angular/material';
import { UserService } from '../user.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {
  //  posts = [{ name: 'Birame', post: 'je suis bien là' }, { name: 'Mouhamed', post: 'je suis bien là avec mon ü' }];
  posts: Post[] = [];
  isLoading = false;
  totalPosts = 0;
  sizePage = 2;
  currentPage = 1;
  sizePageOption = [2, 4, 8, 10];
  isAuth = false;
  userId: string;
  private isAuthSubs: Subscription;
  private postSub: Subscription;
  private postUpdated = new Subject<Post[]>();
  constructor(private postService: PostService, private userService: UserService) {}

  ngOnInit() {
    this.isLoading = true;
    this.postService.getPosts(this.currentPage, this.sizePage);
    this.postSub = this.postService.getUpdatedListener().subscribe(post => {
      this.posts = post.posts;
      this.totalPosts = post.postsCount;
      this.isLoading = false;
    });
    this.userId = this.userService.getIdUser();
    this.isAuth = this.userService.getIsAuth();
    this.isAuthSubs = this.userService.getUserAuthenticateListener().subscribe(authValue => {
      this.isAuth = authValue;
      this.userId = this.userService.getIdUser();
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;
    this.postService.deletePost(postId).subscribe(() => {
      this.postService.getPosts(this.currentPage, this.sizePage);
    });
  }

  onImageChange(page: PageEvent) {
    this.isLoading = true;
    this.currentPage = page.pageIndex + 1;
    this.sizePage = page.pageSize;
    this.postService.getPosts(this.currentPage, this.sizePage);
  }

  ngOnDestroy() {
    this.postSub.unsubscribe();
    this.isAuthSubs.unsubscribe();
  }
}
