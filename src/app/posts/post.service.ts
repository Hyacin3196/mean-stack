import {Observable, Subject, Subscription} from 'rxjs';
import {Post} from './post.model';
import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {map} from 'rxjs/operators';
import {Router} from '@angular/router';

import {environment} from '../../environments/environment';

const BACKEND_URL = environment.apiUrl + '/posts/';

@Injectable({providedIn: 'root'})
export class PostService {
  private posts: Post[] = [];
  private postUpdate = new Subject<{ posts: Post[], postCount: number }>();

  constructor(private http: HttpClient, private router: Router) {
  }

  getPosts(postsPerPage: number, currentPage: number): Subscription {
    const queryParams = `?pageSize=${postsPerPage}&page=${currentPage}`;
    return this.http.get<{ message: string, posts: any, maxPosts: number }>(BACKEND_URL + queryParams)
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
              imagePath: post.imagePath,
              creator: post.creator
            };
          }),
          maxPosts: postData.maxPosts
        };
      }))
      .subscribe((postPayload) => {
        this.posts = postPayload.posts;
        this.postUpdate.next({
          posts: [...this.posts],
          postCount: postPayload.maxPosts
        });
      });
  }

  // We're using http here because this.posts in post-list does not initialise when refreshing from another page
  getPost(id: string): Observable<any> {
    return this.http.get<{
      _id: string,
      title: string,
      content: string,
      image: string,
      creator: string
    }>(BACKEND_URL + id);
  }

  getPostUpdateListener(): Observable<any> {
    return this.postUpdate.asObservable();
  }

  addPost(title: string, content: string, image: File): void {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);
    this.http
      .post<{ message: string }>(
        BACKEND_URL,
        postData
      )
      .subscribe((responseData: { message: string, post: Post }) => {
        /*const post: Post = {
          id: responseData.post.id,
          title,
          content,
          imagePath: responseData.post.imagePath
        };
        this.posts.push(post);
        this.postUpdate.next([...this.posts]);*/
        this.router.navigate(['/']);
      });
  }

  updatePost(id: string, title: string, content: string, image: File | string): void {
    let postData: Post | FormData;
    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id);
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title);
    } else {
      postData = {
        id,
        title,
        content,
        imagePath: image,
        creator: null
      };
    }
    this.http.put<{ message: string }>(BACKEND_URL + id, postData)
      .subscribe((responseData) => {
        /*const updatedPosts = [...this.posts];
        const oldPostIndex = this.posts.findIndex(p => p.id === id);
        const post: Post = {
          id,
          title,
          content,
          imagePath: '',
        };
        updatedPosts[oldPostIndex] = post;
        this.posts = updatedPosts;
        this.postUpdate.next([...this.posts]);*/
        this.router.navigate(['/']);
      });
  }

  deletePost(postId: string): Observable<any> {
    return this.http.delete(BACKEND_URL + postId);
  }
}
