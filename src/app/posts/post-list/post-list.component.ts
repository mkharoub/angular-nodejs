import {Component, OnInit, OnDestroy} from "@angular/core";
import {Subscription} from 'rxjs';

import {Post} from "../post.model";
import {PostsService} from "../posts.service";
import {PageEvent} from "@angular/material/paginator";
import {AuthService} from "../../auth/auth.service";

@Component({
  selector: "app-post-list",
  templateUrl: "./post-list.component.html",
  styleUrls: ["./post-list.component.scss"]
})
export class PostListComponent implements OnInit, OnDestroy {
  // posts = [
  //   { title: "First Post", content: "This is the first post's content" },
  //   { title: "Second Post", content: "This is the second post's content" },
  //   { title: "Third Post", content: "This is the third post's content" }
  // ];
  public posts: Post[] = [];
  public isLoading = false;
  private postsSub: Subscription | undefined;
  private listenerSub$: Subscription | undefined;
  public isAuthenticated = false;

  totalPosts = 0;
  postsPerPage = 2;
  pageSizeOptions = [1, 2, 5, 10];
  currentPage = 1;
  userId: string | undefined;

  constructor(public postsService: PostsService, private authService: AuthService) {
  }

  ngOnInit() {
    this.isLoading = true;
    this.postsService.getPosts(this.postsPerPage, 1);
    this.userId = this.authService.getUserId();
    this.postsSub = this.postsService.getPostUpdateListener()
      .subscribe((postsData: { posts: Post[], postsCount: number }) => {
        this.posts = postsData.posts;
        this.totalPosts = postsData.postsCount;
        this.isLoading = false;
      });
    this.listenerSub$ = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
      this.userId = this.authService.getUserId();
    });
  }

  onDelete(id: string) {
    this.postsService.deletePost(id).subscribe(() => {
      this.isLoading = true;
      this.postsService.getPosts(this.postsPerPage, this.currentPage);
    });
  }

  onPageChanged(pageData: PageEvent) {
    this.isLoading = true;
    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.postsService.getPosts(this.postsPerPage, this.currentPage);
  }

  ngOnDestroy() {
    this.postsSub?.unsubscribe();
    this.listenerSub$?.unsubscribe();
  }
}
