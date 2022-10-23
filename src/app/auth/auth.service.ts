import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from "rxjs";
import {Router} from "@angular/router";

import {AuthData} from "./auth.model";

@Injectable({providedIn: 'root'})
export class AuthService {
  private token: string | undefined;
  private authStatusListener = new BehaviorSubject<boolean>(false);
  private tokenTimer: any;

  constructor(private httpClient: HttpClient, private router: Router) {
  }

  createUser(email: string, password: string) {
    const authData: AuthData = {
      email,
      password
    }

    this.httpClient.post<any>('http://localhost:3000/api/user/signup', authData)
      .subscribe(response => {
        console.log("response", response)
      })
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email, password
    }

    this.httpClient.post<{ token: string; expiresIn: number }>('http://localhost:3000/api/user/login', authData).subscribe(result => {
      const expiresInDuration = result.expiresIn;
      this.token = result.token;

      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, expiresInDuration * 1000);

      const expirationDate = new Date().getTime() + expiresInDuration * 1000;
      this.saveAuthData(this.token, new Date(expirationDate));

      this.authStatusListener.next(!!this.token);
      this.router.navigate(['/']);
    });
  }

  logout() {
    clearTimeout(this.tokenTimer);
    this.clearAuthData();

    this.token = '';
    this.authStatusListener.next(false);
    this.router.navigate(['/']);
  }

  getToken() {
    return this.token;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
  }

  autoAuthUser() {
    const token = localStorage.getItem('token');
    const expirationDateIOS = localStorage.getItem('expirationDate');

    if (!token || !expirationDateIOS) return;

    const now = new Date();
    const expirationDate = new Date(expirationDateIOS);
    const expiresIn = expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = token;
      this.tokenTimer = setTimeout(() => {
        this.logout();
      }, expiresIn);
      this.authStatusListener.next(!!this.token);
    }
  }
}
