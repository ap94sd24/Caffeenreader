import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

import { environment } from './../../environments/environment';
import { AuthData } from './auth-data.model';

const BACKEND_URL = environment.routes_url + '/users/';

@Injectable({providedIn: 'root'})
export class AuthService {
    private token: string;
    private isAuth = false;
    private timerToken: any;
    private userId: string;
    private authStatusListener = new Subject<boolean>();

    constructor(private http: HttpClient, private router: Router) {}

    getToken() {
      return this.token;
    }

    getIsAuth() {
      return this.isAuth;
    }

    getUserId() {
      return this.userId;
    }

    getAuthStatusListener() {
      return this.authStatusListener.asObservable();
    }

    getUserInfos(id: string) {
      return this.http.get<{
        _id: string,
        username: string,
        displayname: string,
        email: string
      }>(BACKEND_URL + id);
    }

    createUser(auth: AuthData) {
      return this.http.post<{token: string, expiresIn: number, userId: string }>(BACKEND_URL + '/signup', auth).subscribe((response) => {
        this.token = response.token;
        if (this.token) {
          const expirationDuration = response.expiresIn;
          this.setAuthTimer(expirationDuration);
          this.isAuth = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expirationDuration * 1000);
          this.saveAuthData(this.token, expirationDate, this.userId);
          this.router.navigateByUrl('/');
        }
      }, error => {
        this.authStatusListener.next(false);
      });
    }

    login(auth: AuthData) {
      this.http.post<{token: string, expiresIn: number, userId: string}>(BACKEND_URL + '/login', auth)
      .subscribe(response => {
          this.token = response.token;
          if (this.token) {
            const expirationDuration = response.expiresIn;
            this.setAuthTimer(expirationDuration);
            this.isAuth = true;
            this.userId = response.userId;
            this.authStatusListener.next(true);
            const now = new Date();
            const expirationDate = new Date(now.getTime() + expirationDuration * 1000);
            this.saveAuthData(this.token, expirationDate, this.userId);

            this.router.navigate(['/']);
          }
      }, error => {
        this.authStatusListener.next(false);
      });
    }

    autoAuthUser() {
      const authInfo = this.getAuthData();
      if (!authInfo) {
        return;
      }
      const now = new Date();
      const expiresIn = authInfo.expirationDate.getTime() - now.getTime();
      if (expiresIn > 0) {
        this.token = authInfo.token;
        this.isAuth = true;
        this.userId = authInfo.userId;
        this.setAuthTimer(expiresIn / 1000);
        this.authStatusListener.next(true);
      }
    }

    logout() {
      this.token = null;
      this.isAuth = false;
      this.authStatusListener.next(false);
      clearTimeout(this.timerToken);
      this.clearAuthStorage();
      this.userId = null;
      this.router.navigate(['/auth/signin']);
    }

    private setAuthTimer(duration: number) {
      this.timerToken = setTimeout(() => {
        this.logout();
      }, duration * 1000);
    }

    private saveAuthData(token: string, expirationDate: Date, userId: string) {
      localStorage.setItem('token', token);
      localStorage.setItem('expiration', expirationDate.toISOString());
      localStorage.setItem('userId', userId);
    }

    private clearAuthStorage() {
      localStorage.removeItem('token');
      localStorage.removeItem('expiration');
      localStorage.removeItem('userId');
    }

    private getAuthData() {
      const token = localStorage.getItem('token');
      const expirationDate = localStorage.getItem('expiration');
      const userId = localStorage.getItem('userId');
      if (!token || !expirationDate) {
        return;
      }
      return {
        token: token,
        expirationDate: new Date(expirationDate),
        userId: userId
      };
    }
}
