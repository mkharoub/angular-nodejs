import {Component, OnDestroy, OnInit} from "@angular/core";
import {Subscription} from "rxjs";

import {AuthService} from "../auth/auth.service";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html'
})
export class HeaderComponent implements OnInit, OnDestroy {
  private listenerSub$: Subscription | undefined;
  public isAuthenticated = false

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.listenerSub$ = this.authService.getAuthStatusListener().subscribe(isAuth => {
      this.isAuthenticated = isAuth;
    });
  }

  onLogout() {
    this.authService.logout();
  }

  ngOnDestroy() {
    this.listenerSub$?.unsubscribe();
  }
}
