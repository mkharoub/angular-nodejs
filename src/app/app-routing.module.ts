import {NgModule} from "@angular/core";
import {Route, RouterModule} from "@angular/router";

import {PostListComponent} from "./posts/post-list/post-list.component";
import {PostCreateComponent} from "./posts/post-create/post-create.component";
import {LoginComponent} from "./auth/login/login.component";
import {SignupComponent} from "./auth/signup/signup.component";
import {AuthGuard} from "./auth/auth.guard";
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
    canActivate: [AuthGuard]
  },
  {
    path: 'edit/:id',
    component: PostCreateComponent,
    // resolve: [PostResolver],
    canActivate: [AuthGuard]
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule {
}
