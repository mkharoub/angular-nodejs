import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {map, Subject, tap} from 'rxjs';
import {Router} from "@angular/router";

import {Post} from './post.model';

@Injectable({providedIn: 'root'})
export class PostsService {
  private posts: Post[] = [];
  private postsUpdated = new Subject<{ posts: Post[], postsCount: number }>();

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  getPosts(postsPerPage: number, currentPage: number) {
    const queryParams = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.httpClient.get<{ message: string, posts: any, maxPosts: number }>('http://localhost:3000/api/posts' + queryParams)
      .pipe(
        map(postsData => {
          return {
            posts: postsData.posts.map((post: any) => {
                return {
                  id: post._id,
                  title: post.title,
                  content: post.content,
                  imagePath: post.imagePath
                }
              }
            ),
            maxPosts: postsData.maxPosts
          }
        })
      )
      .subscribe((transformedPostsData) => {
        this.posts = transformedPostsData.posts;
        this.postsUpdated.next({
          posts: [...this.posts],
          postsCount: transformedPostsData.maxPosts
        });
      })
  }

  getPost(postId: string) {
    return this.httpClient.get<{ message: string, post: any }>('http://localhost:3000/api/posts/' + postId)
      .pipe(
        map(postData => {
          return {
            id: postData.post._id,
            title: postData.post.title,
            content: postData.post.content,
            imagePath: postData.post.imagePath
          }
        })
      );
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    /**
     * Here we've changed the request from json to FormData, so we can upload the file,
     * Note that we were sending the post (json) now we're sending the postData(FormData),
     * the angular httpClient will detect it and set the right headers.
     */
    const postData = new FormData();

    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.httpClient.post<{ message: string, post: Post }>('http://localhost:3000/api/posts', postData)
      .subscribe(postData => {
        this.router.navigate(['/']);
      })
  }

  updatePost(id: string, title: string, content: string, image: File | string) {
    let post: Post | FormData;

    if (typeof image === 'object') {
      post = new FormData();

      post.append('id', id);
      post.append('title', title);
      post.append('content', content);
      post.append('image', image);
    } else {
      post = {id, title, content, imagePath: image};
    }

    this.httpClient.put<{ message: string, post: Post }>('http://localhost:3000/api/posts/' + id, post)
      .subscribe((postData) => {
        this.router.navigate(['/']);
      });
  }

  deletePost(id: string) {
    return this.httpClient.delete<{ message: string }>('http://localhost:3000/api/posts/' + id);
  }
}
