import { Injectable } from '@angular/core';
import { Post } from './post';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { ModelResponse } from './model-response';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private posts: Post[] = [];
  private postUpdated = new Subject<{ posts: Post[]; postsCount: number }>();
  constructor(private http: HttpClient, private route: Router) {}

  getPosts(currentPage: number, pageSize: number) {
    const queryParams = `?page=${currentPage}&size=${pageSize}`;
    this.http
      .get<{ message: string; post: any; maxPost: number }>(BACKEND_URL + queryParams)
      .pipe(
        map(responseData => {
          return {
            postGet: responseData.post.map(postData => {
              return {
                creator: postData.creator,
                imagePath: postData.imagePath,
                name: postData.name,
                post: postData.post,
                id: postData._id
              };
            }),
            maxPost: responseData.maxPost
          };
        })
      )
      .subscribe(transformedData => {
        this.posts = transformedData.postGet;
        this.postUpdated.next({ posts: [...this.posts], postsCount: transformedData.maxPost });
      });
  }

  getUpdatedListener() {
    return this.postUpdated.asObservable();
  }

  updatePost(id: string, name: string, post: string, image: File | string) {
    let postEdit: Post | FormData;
    if (typeof image === 'object') {
      postEdit = new FormData();
      postEdit.append('id', id);
      postEdit.append('name', name);
      postEdit.append('post', post);
      postEdit.append('image', image, name);
    } else {
      postEdit = {
        id: id,
        name: name,
        post: post,
        imagePath: image,
        creator: null
      };
    }
    this.http.put<any>(BACKEND_URL + id, postEdit).subscribe(result => {
      this.route.navigate(['/']);
    });
  }

  getPostId(id: string): Observable<any> {
    return this.http.get<any>(BACKEND_URL + id);
  }

  addPost(name: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('name', name);
    postData.append('post', content);
    postData.append('image', image, name);
    this.http.post<any>(BACKEND_URL, postData).subscribe(res => {
      this.route.navigate(['/']);
    });
  }

  deletePost(postId: string) {
    return this.http.delete(BACKEND_URL + postId);
  }
}
