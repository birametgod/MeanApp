import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { User } from './user';
import { environment } from 'src/environments/environment';

const BACKEND_URL = environment.apiUrl + '/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  token: string;
  idUser: string;
  isAuthenticate = false;
  private userAuthenticate = new Subject<boolean>();
  private myTimer: any;
  constructor(private http: HttpClient, private route: Router) {}

  addUser(email: string, password: string) {
    const user: User = {
      email: email,
      password: password
    };
    this.http.post<{ message: string; result: User }>(BACKEND_URL + '/signup', user).subscribe(
      res => {
        this.route.navigate(['/']);
      },
      error => {
        this.userAuthenticate.next(false);
      }
    );
  }

  getToken(): string {
    return this.token;
  }

  getIsAuth(): boolean {
    return this.isAuthenticate;
  }

  getIdUser(): string {
    return this.idUser;
  }

  getUserAuthenticateListener(): Observable<any> {
    return this.userAuthenticate.asObservable();
  }

  logout() {
    this.token = null;
    this.idUser = null;
    this.isAuthenticate = false;
    this.userAuthenticate.next(false);
    clearTimeout(this.myTimer);
    this.clearAuthData();
    this.route.navigate(['/']);
  }

  userLogin(email: string, password: string) {
    const user: User = {
      email: email,
      password: password
    };
    this.http
      .post<{ message: string; user: any; token: string; expiresIn: number }>(BACKEND_URL + '/login', user)
      .subscribe(
        res => {
          this.token = res.token;
          if (res.token) {
            this.setTimer(res.expiresIn);
          }
          this.idUser = res.user._id;
          const now = new Date();
          const expireDate = new Date(now.getTime() + res.expiresIn * 1000);
          this.saveAuthData(res.token, expireDate);
          this.isAuthenticate = true;
          this.userAuthenticate.next(true);
          this.route.navigate(['/']);
        },
        error => {
          this.userAuthenticate.next(false);
        }
      );
  }

  autoUserAuth() {
    const authData = this.getAuhtData();
    const now = new Date();
    if (!authData) {
      return;
    }
    const expiresIn = authData.expirationDate.getTime() - now.getTime();
    if (expiresIn > 0) {
      this.setTimer(expiresIn / 1000);
      this.token = authData.token;
      this.idUser = authData.userId;
      this.isAuthenticate = true;
      this.userAuthenticate.next(true);
    }
  }

  private setTimer(duration: number) {
    this.myTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date) {
    localStorage.setItem('token', token);
    localStorage.setItem('expirationDate', expirationDate.toISOString());
    localStorage.setItem('userId', this.idUser);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expirationDate');
    localStorage.removeItem('userId');
  }

  private getAuhtData() {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expirationDate');
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
