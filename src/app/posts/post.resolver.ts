// import {Injectable} from "@angular/core";
// import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
// import {Observable} from "rxjs";
//
// import {Post} from "./post.model";
// import {PostsService} from "./posts.service";
//
// @Injectable()
// export class PostResolver implements Resolve<Post> {
//   constructor(private postsService: PostsService) {
//   }
//
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post> | Promise<Post> | Post {
//     const postId = route.paramMap.get('id');
//     const post = this.postsService.getPost(postId as any);
//
//     if (post) return post as any;
//
//     return this.postsService.fetchPost(postId as any);
//   }
// }
