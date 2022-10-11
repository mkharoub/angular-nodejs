import {NgModule} from "@angular/core";
import {Route, RouterModule} from "@angular/router";

import {PostListComponent} from "./posts/post-list/post-list.component";
import {PostCreateComponent} from "./posts/post-create/post-create.component";
// import {PostsResolver} from "./posts/posts.resolver";
// import {PostResolver} from "./posts/post.resolver";

const routes: Route[] = [
  {
    path: '',
    component: PostListComponent,
    pathMatch: 'full'
  },
  {
    path: 'create',
    component: PostCreateComponent,
  },
  {
    path: 'edit/:id',
    component: PostCreateComponent,
    // resolve: [PostResolver]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
