// import {ActivatedRouteSnapshot, Resolve, RouterStateSnapshot} from "@angular/router";
// import {Injectable} from "@angular/core";
// import {Observable} from "rxjs";
//
// import {Post} from "./post.model";
// import {PostsService} from "./posts.service";
//
//
// @Injectable()
// export class PostsResolver implements Resolve<Post[]> {
//   constructor(private postsService: PostsService) {
//   }
//
//   resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Post[]> | Promise<Post[]> | Post[] {
//     const posts = this.postsService.getPosts();
//
//     if (posts.length) return posts;
//
//     return this.postsService.fetchPosts();
//   }
// }
